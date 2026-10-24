import { HttpError, json, randomToken, readCookie, redirect, setCookie, sha256 } from '../http.js'
import { memberFor, type Authenticator, type Identity } from '../identity.js'
import type { Store } from '../store/types.js'

const SESSION_COOKIE = '__Host-chi_admin'
const STATE_COOKIE = '__Host-chi_admin_state'
const SESSION_SECONDS = 12 * 60 * 60
const STATE_SECONDS = 10 * 60
const TIMEOUT_MS = 10_000

type Options = {
  store: Store
  owners: readonly string[]
  origin: string
  clientId: string
  clientSecret: string
  fetchImpl?: typeof fetch
}

/**
 * Sign in with GitHub. GitHub only says who the person is: the OAuth token is
 * used once to read their profile and then dropped, never stored. Whether they
 * may come in is decided by the member list, and their session is a random
 * cookie whose hash is all the database holds.
 */
export class GithubAuthenticator implements Authenticator {
  private options: Options
  private fetchImpl: typeof fetch

  constructor(options: Options) {
    this.options = options
    this.fetchImpl = options.fetchImpl ?? fetch
  }

  async identify(request: Request): Promise<Identity | null> {
    const token = readCookie(request, SESSION_COOKIE)
    if (!token) return null
    const session = await this.options.store.findSession(sha256(token))
    if (!session) return null
    // The role is read fresh on every request, so a change on the Members page
    // applies at once.
    const member = await memberFor(this.options.store, this.options.owners, session.login)
    if (!member) return null
    return { login: member.login, role: member.role, githubId: session.githubId, name: session.name, avatarUrl: session.avatarUrl, csrfToken: session.csrfToken }
  }

  async login() {
    const state = randomToken()
    await this.options.store.saveOAuthState(sha256(state), new Date(Date.now() + STATE_SECONDS * 1000))
    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set('client_id', this.options.clientId)
    url.searchParams.set('redirect_uri', `${this.options.origin}/api/auth/callback`)
    url.searchParams.set('state', state)
    url.searchParams.set('allow_signup', 'false')
    return redirect(url.toString(), [setCookie(STATE_COOKIE, state, STATE_SECONDS)])
  }

  async callback(request: Request) {
    const params = new URL(request.url).searchParams
    const code = params.get('code')
    const state = params.get('state')
    const fail = (reason: string) => redirect(`/sign-in?error=${reason}`, [setCookie(STATE_COOKIE, '', 0)])
    // The state must match the cookie set when this browser started signing in,
    // and is accepted once: a link from anywhere else can't complete a sign-in.
    if (!code || !state || readCookie(request, STATE_COOKIE) !== state) return fail('expired')
    if (!await this.options.store.takeOAuthState(sha256(state))) return fail('expired')

    let profile: { id: number; login: string; name?: string | null; avatar_url?: string }
    try {
      profile = await this.profileFor(code)
    } catch (error) {
      console.error('github_sign_in_failed', error instanceof Error ? error.message : error)
      return fail('github')
    }
    const member = await memberFor(this.options.store, this.options.owners, profile.login)
    if (!member) return fail('not_a_member')

    const details = { githubId: profile.id, name: profile.name ?? undefined, avatarUrl: profile.avatar_url }
    await this.options.store.touchMember(member.login, details)
    const token = randomToken()
    await this.options.store.createSession(sha256(token), {
      login: member.login,
      ...details,
      csrfToken: randomToken(),
      expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000).toISOString(),
    })
    await this.options.store.logActivity({ login: member.login, action: 'sign_in', summary: 'Signed in' })
    return redirect('/', [setCookie(SESSION_COOKIE, token, SESSION_SECONDS), setCookie(STATE_COOKIE, '', 0)])
  }

  async logout(request: Request) {
    const token = readCookie(request, SESSION_COOKIE)
    if (token) await this.options.store.deleteSession(sha256(token))
    return json({ signedOut: true }, 200, { 'set-cookie': setCookie(SESSION_COOKIE, '', 0) })
  }

  private async profileFor(code: string) {
    const exchange = await this.fetchImpl('https://github.com/login/oauth/access_token', {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        code,
        redirect_uri: `${this.options.origin}/api/auth/callback`,
      }),
    })
    const { access_token: accessToken } = await exchange.json() as { access_token?: string }
    if (!accessToken) throw new HttpError(502, 'github_exchange_failed')
    const user = await this.fetchImpl('https://api.github.com/user', {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${accessToken}`, 'user-agent': 'chi-square-admin' },
    })
    if (!user.ok) throw new HttpError(502, 'github_profile_failed')
    return await user.json() as { id: number; login: string; name?: string | null; avatar_url?: string }
  }
}
