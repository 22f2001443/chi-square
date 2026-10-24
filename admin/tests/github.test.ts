import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GithubRepository } from '../server/content/github.js'
import { HttpError } from '../server/http.js'

type Call = { url: string; body: any; authorization: string | null }

function fakeGraphql(answer: (body: any) => unknown) {
  const calls: Call[] = []
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const body = init?.body ? JSON.parse(String(init.body)) : undefined
    calls.push({ url: String(input), body, authorization: new Headers(init?.headers).get('authorization') })
    return Response.json(answer(body))
  }) as typeof fetch
  return { calls, fetchImpl }
}

const files = (texts: Record<string, string>, head = 'head1') => ({
  data: {
    repository: {
      ref: { target: { oid: head } },
      ...Object.fromEntries(Object.values(texts).map((text, index) => [`f${index}`, { oid: `sha-${text}`, text, isTruncated: false }])),
    },
  },
})

test('reads every file at the branch head in one query', async () => {
  const { calls, fetchImpl } = fakeGraphql(() => files({ a: 'one', b: 'two' }))
  const repo = new GithubRepository({ kind: 'token', token: 'tok' }, 'main', fetchImpl)
  const read = await repo.readFiles(['frontend-react/a.yml', 'frontend-react/b.yml'])
  assert.deepEqual(read, { 'frontend-react/a.yml': { text: 'one', sha: 'sha-one' }, 'frontend-react/b.yml': { text: 'two', sha: 'sha-two' } })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].authorization, 'Bearer tok')
  assert.equal(calls[0].body.variables.e0, 'main:frontend-react/a.yml')
  assert.equal(calls[0].body.variables.owner, '22f2001443')
  assert.equal(calls[0].body.variables.name, 'chi-square')
})

test('commits every file at once, guarded by the head it read', async () => {
  const { calls, fetchImpl } = fakeGraphql(body => (body.query.startsWith('mutation')
    ? { data: { createCommitOnBranch: { commit: { oid: 'new1', url: 'https://github.com/c/new1' } } } }
    : files({ a: 'one' }, 'head7')))
  const repo = new GithubRepository({ kind: 'token', token: 'tok' }, 'main', fetchImpl)
  const result = await repo.commit([{ path: 'frontend-react/a.yml', text: 'uno', baseSha: 'sha-one' }], 'Headline\n\n- did a thing')
  assert.deepEqual(result, { commit: 'new1', url: 'https://github.com/c/new1' })
  const input = calls[1].body.variables.input
  assert.equal(input.expectedHeadOid, 'head7')
  assert.deepEqual(input.branch, { repositoryNameWithOwner: '22f2001443/chi-square', branchName: 'main' })
  assert.deepEqual(input.message, { headline: 'Headline', body: '- did a thing' })
  assert.equal(Buffer.from(input.fileChanges.additions[0].contents, 'base64').toString(), 'uno')
})

test('refuses to commit over a file that changed since it was edited', async () => {
  const { calls, fetchImpl } = fakeGraphql(() => files({ a: 'changed-on-github' }))
  const repo = new GithubRepository({ kind: 'token', token: 'tok' }, 'main', fetchImpl)
  await assert.rejects(repo.commit([{ path: 'frontend-react/a.yml', text: 'mine', baseSha: 'sha-one' }], 'x'), (error: HttpError) => error.status === 409 && error.code === 'publish_conflict')
  assert.equal(calls.length, 1, 'no mutation was sent')
})

test('a moved branch is a conflict, not an outage', async () => {
  const { fetchImpl } = fakeGraphql(body => (body.query.startsWith('mutation')
    ? { errors: [{ message: 'Expected branch to point to "head1" but it did not.' }] }
    : files({ a: 'one' })))
  const repo = new GithubRepository({ kind: 'token', token: 'tok' }, 'main', fetchImpl)
  await assert.rejects(repo.commit([{ path: 'frontend-react/a.yml', text: 'uno', baseSha: 'sha-one' }], 'x'), (error: HttpError) => error.status === 409)
})
