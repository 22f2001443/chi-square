import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { files, fileIds } from '../shared/collections.js'
import type { ContentResponse, PendingResponse } from '../shared/api.js'
import { handle, type AppContext } from '../server/app.js'
import { GithubAuthenticator } from '../server/auth/github.js'
import { readConfig } from '../server/config.js'
import { ContentService } from '../server/content/service.js'
import type { CommitFile, Repository } from '../server/content/repository.js'
import { HttpError, sha256 } from '../server/http.js'
import { MemberService } from '../server/members.js'
import { MemoryStore } from '../server/store/memory.js'

const ORIGIN = 'https://admin.example.org'

class FakeRepository implements Repository {
  texts = new Map<string, string>(fileIds.map(id => [files[id], readFileSync(new URL(`../../${files[id]}`, import.meta.url), 'utf8')]))
  commits: { files: CommitFile[]; message: string }[] = []
  info() {
    return { kind: 'github' as const, label: 'test', assetBase: 'https://raw.example/' }
  }
  async readFiles(paths: readonly string[]) {
    return Object.fromEntries(paths.map(path => [path, { text: this.texts.get(path)!, sha: sha256(this.texts.get(path)!) }]))
  }
  async commit(changes: CommitFile[], message: string) {
    if (changes.some(file => sha256(this.texts.get(file.path)!) !== file.baseSha)) throw new HttpError(409, 'publish_conflict')
    for (const file of changes) this.texts.set(file.path, file.text)
    this.commits.push({ files: changes, message })
    return { commit: 'abcdef1234567890' }
  }
}

type Profile = { id: number; login: string; name?: string }

// GitHub's two OAuth endpoints, answering for whoever `profile` is.
function fakeGithub(profile: () => Profile): typeof fetch {
  return (async (input: string | URL | Request) => {
    const url = String(input)
    if (url === 'https://github.com/login/oauth/access_token') return Response.json({ access_token: 'gho_test' })
    if (url === 'https://api.github.com/user') return Response.json(profile())
    throw new Error(`unexpected ${url}`)
  }) as typeof fetch
}

function setup() {
  const store = new MemoryStore()
  const repository = new FakeRepository()
  let profile: Profile = { id: 1, login: 'Owner-One', name: 'Owner One' }
  const owners = ['owner-one']
  const context: AppContext = {
    auth: new GithubAuthenticator({ store, owners, origin: ORIGIN, clientId: 'client', clientSecret: 'secret', fetchImpl: fakeGithub(() => profile) }),
    content: new ContentService(repository, store),
    members: new MemberService(store, owners),
    store,
    origin: () => ORIGIN,
  }
  const call = (path: string, init: RequestInit & { cookie?: string } = {}) => {
    const headers = new Headers(init.headers)
    if (init.cookie) headers.set('cookie', init.cookie)
    return handle(new Request(`${ORIGIN}${path}`, { ...init, headers }), context)
  }

  async function signIn(as: Profile) {
    profile = as
    const start = await call('/api/auth/login')
    const location = new URL(start.headers.get('location')!)
    const state = location.searchParams.get('state')!
    const stateCookie = start.headers.get('set-cookie')!.split(';')[0]
    const done = await call(`/api/auth/callback?code=abc&state=${state}`, { cookie: stateCookie })
    const cookie = done.headers.getSetCookie().find(value => value.startsWith('__Host-chi_admin='))?.split(';')[0]
    if (!cookie) return { location: done.headers.get('location') }
    const session = await (await call('/api/session', { cookie })).json()
    const send = (path: string, method: string, body?: unknown) => call(path, {
      method,
      cookie,
      headers: { origin: ORIGIN, 'x-csrf-token': session.csrfToken, 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    return { location: done.headers.get('location'), cookie, session, send, get: (path: string) => call(path, { cookie }) }
  }
  return { call, signIn, store, repository }
}

test('nothing but signing in works without a session', async () => {
  const { call } = setup()
  assert.equal((await call('/api/session')).status, 401)
  assert.equal((await call('/api/content')).status, 401)
  assert.equal((await call('/api/publish', { method: 'POST' })).status, 401)
  const login = await call('/api/auth/login')
  assert.equal(login.status, 302)
  const url = new URL(login.headers.get('location')!)
  assert.equal(url.origin + url.pathname, 'https://github.com/login/oauth/authorize')
  assert.equal(url.searchParams.get('redirect_uri'), `${ORIGIN}/api/auth/callback`)
})

test('a sign-in must finish in the browser that started it, once', async () => {
  const { call } = setup()
  const start = await call('/api/auth/login')
  const state = new URL(start.headers.get('location')!).searchParams.get('state')!
  const cookie = start.headers.get('set-cookie')!.split(';')[0]
  const noCookie = await call(`/api/auth/callback?code=x&state=${state}`)
  assert.equal(noCookie.headers.get('location'), '/sign-in?error=expired')
  const first = await call(`/api/auth/callback?code=x&state=${state}`, { cookie })
  assert.equal(first.headers.get('location'), '/')
  const replay = await call(`/api/auth/callback?code=x&state=${state}`, { cookie })
  assert.equal(replay.headers.get('location'), '/sign-in?error=expired')
})

test('only members can sign in, and removing one ends their session', async () => {
  const { signIn } = setup()
  const stranger = await signIn({ id: 9, login: 'stranger' })
  assert.equal(stranger.location, '/sign-in?error=not_a_member')

  const owner = await signIn({ id: 1, login: 'Owner-One' })
  assert.equal(owner.session.user.role, 'owner')
  assert.equal((await owner.send!('/api/members', 'POST', { login: '@Editor-Two', role: 'editor' })).status, 201)

  const editor = await signIn({ id: 2, login: 'editor-two' })
  assert.equal(editor.session.user.role, 'editor')
  assert.equal((await editor.send!('/api/members', 'POST', { login: 'third', role: 'owner' })).status, 403)

  assert.equal((await owner.send!('/api/members/editor-two', 'DELETE')).status, 200)
  assert.equal((await editor.get!('/api/session')).status, 401)
  assert.equal((await owner.send!('/api/members/owner-one', 'DELETE')).status, 409, 'ADMIN_OWNERS can’t be removed here')
})

test('a change needs this origin and the session’s CSRF token', async () => {
  const { signIn, call } = setup()
  const owner = await signIn({ id: 1, login: 'owner-one' })
  const content = await (await owner.get!('/api/content')).json() as ContentResponse
  const body = JSON.stringify({ op: 'update', hash: content.files.home.hash, value: { title: 'x' } })
  const missingToken = await call('/api/content/home.partners', { method: 'POST', cookie: owner.cookie, headers: { origin: ORIGIN }, body })
  assert.equal(missingToken.status, 403)
  const otherSite = await call('/api/content/home.partners', { method: 'POST', cookie: owner.cookie, headers: { origin: 'https://evil.example', 'x-csrf-token': owner.session.csrfToken }, body })
  assert.equal(otherSite.status, 403)
  assert.equal((await owner.send!('/api/content/home.partners', 'POST', JSON.parse(body))).status, 200)
})

test('edits wait as pending changes until an owner publishes them in one commit', async () => {
  const { signIn, repository } = setup()
  const owner = await signIn({ id: 1, login: 'owner-one' })
  await owner.send!('/api/members', 'POST', { login: 'editor-two', role: 'editor' })
  const editor = await signIn({ id: 2, login: 'editor-two' })

  let content = await (await editor.get!('/api/content')).json() as ContentResponse
  const change = await editor.send!('/api/content/home.partners', 'POST', { op: 'update', hash: content.files.home.hash, value: { title: 'Our partners' } })
  assert.equal(change.status, 200)
  const changed = await change.json()
  assert.equal(changed.file.pending, true)
  assert.equal(changed.file.data.partners.title, 'Our partners')
  assert.equal(repository.texts.get(files.home)!.includes('Our partners'), false, 'nothing is committed yet')

  // The editor's view is now out of date for anyone holding the old hash.
  const stale = await owner.send!('/api/content/home.partners', 'POST', { op: 'update', hash: content.files.home.hash, value: { title: 'Mine' } })
  assert.equal(stale.status, 409)

  const pending = await (await owner.get!('/api/pending')).json() as PendingResponse
  assert.equal(pending.files.length, 1)
  assert.deepEqual(pending.files[0].summaries, ['Updated Home › Partners'])
  assert.ok(pending.files[0].after.includes('Our partners') && !pending.files[0].before.includes('Our partners'))

  assert.equal((await editor.send!('/api/publish', 'POST', {})).status, 403, 'editors stage, owners publish')
  const published = await owner.send!('/api/publish', 'POST', { message: 'Rename partners band' })
  assert.equal(published.status, 200)
  assert.equal(repository.commits.length, 1)
  assert.match(repository.commits[0].message, /^Rename partners band\n\n- Updated Home › Partners\n\nCo-authored-by: editor-two <2\+editor-two@users\.noreply\.github\.com>$/)
  assert.ok(repository.texts.get(files.home)!.includes('title: Our partners'))

  content = await (await owner.get!('/api/content')).json() as ContentResponse
  assert.equal(content.files.home.pending, false)
  assert.equal((await owner.send!('/api/publish', 'POST', {})).status, 409)
})

test('an editor can discard only changes nobody else made', async () => {
  const { signIn } = setup()
  const owner = await signIn({ id: 1, login: 'owner-one' })
  await owner.send!('/api/members', 'POST', { login: 'editor-two', role: 'editor' })
  const editor = await signIn({ id: 2, login: 'editor-two' })
  const hash = async () => ((await (await editor.get!('/api/content')).json()) as ContentResponse).files.home.hash
  await editor.send!('/api/content/home.partners', 'POST', { op: 'update', hash: await hash(), value: { title: 'A' } })
  assert.equal((await editor.send!('/api/pending?file=home', 'DELETE')).status, 200)
  await editor.send!('/api/content/home.partners', 'POST', { op: 'update', hash: await hash(), value: { title: 'B' } })
  await owner.send!('/api/content/home.partners', 'POST', { op: 'update', hash: await hash(), value: { title: 'C' } })
  assert.equal((await editor.send!('/api/pending?file=home', 'DELETE')).status, 403)
  assert.equal((await owner.send!('/api/pending', 'DELETE')).status, 200)
})

test('a publish is refused when GitHub changed the file underneath', async () => {
  const { signIn, repository } = setup()
  const owner = await signIn({ id: 1, login: 'owner-one' })
  const content = await (await owner.get!('/api/content')).json() as ContentResponse
  await owner.send!('/api/content/home.partners', 'POST', { op: 'update', hash: content.files.home.hash, value: { title: 'Ours' } })
  repository.texts.set(files.home, repository.texts.get(files.home) + '# edited on GitHub\n')
  assert.equal((await owner.send!('/api/publish', 'POST', {})).status, 409)
})

test('the deployment stays shut until every setting is present', async () => {
  const missing = readConfig({ ADMIN_ORIGIN: 'http://insecure.example', PUBLISH_BRANCH: '../main' })
  assert.ok('missing' in missing)
  assert.deepEqual(missing.missing, ['ADMIN_ORIGIN', 'ADMIN_OWNERS', 'GITHUB_OAUTH_CLIENT_ID', 'GITHUB_OAUTH_CLIENT_SECRET', 'DATABASE_URL', 'GITHUB_TOKEN or GITHUB_APP_*', 'PUBLISH_BRANCH'])
  const response = await handle(new Request(`${ORIGIN}/api/session`), missing)
  assert.equal(response.status, 503)
  const ok = readConfig({ ADMIN_ORIGIN: ORIGIN, ADMIN_OWNERS: 'A, b', GITHUB_OAUTH_CLIENT_ID: 'id', GITHUB_OAUTH_CLIENT_SECRET: 's', DATABASE_URL: 'postgres://x', GITHUB_TOKEN: 't' })
  assert.ok('config' in ok)
  assert.deepEqual(ok.config.owners, ['a', 'b'])
  assert.equal(ok.config.branch, 'main')
})
