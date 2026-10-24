import type { ChangeRequest } from '../shared/api.js'
import { fileIds, type FileId } from '../shared/collections.js'
import type { ContentService } from './content/service.js'
import { HttpError, json, readJson, safeEqual } from './http.js'
import type { Authenticator } from './identity.js'
import type { MemberService } from './members.js'
import type { Store } from './store/types.js'

export type AppContext = {
  auth: Authenticator
  content: ContentService
  members: MemberService
  store: Store
  /** The Origin a state-changing request must carry. */
  origin: (request: Request) => string
}

/** The settings that were missing, when the deployment can't start. */
export type Misconfigured = { missing: string[] }

const MEMBER_ROUTE = /^\/api\/members\/([^/]+)$/
const CONTENT_ROUTE = /^\/api\/content\/([a-z0-9.]+)$/i

/**
 * Every /api request. Anything but signing in requires a session; anything
 * that changes state also requires this admin's exact Origin and the session's
 * CSRF token, so another site can't make a signed-in browser act.
 */
export async function handle(request: Request, context: AppContext | Misconfigured): Promise<Response> {
  if ('missing' in context) {
    return json({ error: 'not_configured', message: 'This admin is missing settings in Vercel.', missing: context.missing }, 503)
  }
  try {
    return await route(request, context)
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.code, message: error.message, ...error.extra }, error.status)
    console.error('admin_error', error)
    return json({ error: 'internal', message: 'Something went wrong.' }, 500)
  }
}

async function route(request: Request, context: AppContext): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/+$/, '')
  const method = request.method

  if (path === '/api/auth/login' && method === 'GET') return context.auth.login(request)
  if (path === '/api/auth/callback' && method === 'GET') return context.auth.callback(request)

  const identity = await context.auth.identify(request)
  if (!identity) return json({ error: 'unauthenticated', message: 'Sign in to continue.' }, 401)

  if (method !== 'GET' && method !== 'HEAD') {
    if (request.headers.get('origin') !== context.origin(request)) throw new HttpError(403, 'bad_origin')
    if (!safeEqual(request.headers.get('x-csrf-token') ?? '', identity.csrfToken)) throw new HttpError(403, 'bad_csrf', 'Your session changed. Reload the page.')
  }

  if (path === '/api/session' && method === 'GET') {
    const { csrfToken, login, name, avatarUrl, role } = identity
    return json({ user: { login, name, avatarUrl, role }, csrfToken })
  }
  if (path === '/api/auth/logout' && method === 'POST') return context.auth.logout(request)

  if (path === '/api/content' && method === 'GET') return json(await context.content.load())
  const content = CONTENT_ROUTE.exec(path)
  if (content && method === 'POST') {
    const body = await readJson(request)
    if (typeof body.hash !== 'string' || typeof body.op !== 'string') throw new HttpError(400, 'invalid_body')
    return json(await context.content.change(identity, content[1], body as unknown as ChangeRequest))
  }

  if (path === '/api/pending' && method === 'GET') return json(await context.content.pending())
  if (path === '/api/pending' && method === 'DELETE') {
    const file = url.searchParams.get('file')
    if (file !== null && !fileIds.includes(file as FileId)) throw new HttpError(404, 'file_not_found')
    return json(await context.content.discard(identity, (file ?? undefined) as FileId | undefined))
  }
  if (path === '/api/publish' && method === 'POST') {
    const body = await readJson(request)
    return json(await context.content.publish(identity, typeof body.message === 'string' ? body.message : undefined))
  }

  if (path === '/api/members' && method === 'GET') return json({ members: await context.members.list() })
  if (path === '/api/members' && method === 'POST') {
    const body = await readJson(request)
    return json(await context.members.add(identity, body.login, body.role), 201)
  }
  const member = MEMBER_ROUTE.exec(path)
  if (member && method === 'PATCH') {
    const body = await readJson(request)
    return json(await context.members.setRole(identity, decodeURIComponent(member[1]), body.role))
  }
  if (member && method === 'DELETE') return json(await context.members.remove(identity, decodeURIComponent(member[1])))

  if (path === '/api/activity' && method === 'GET') return json({ activity: await context.store.listActivity(100) })

  return json({ error: 'not_found' }, 404)
}
