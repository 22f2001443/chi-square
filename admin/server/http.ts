import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/** An error meant for the browser: `code` is stable, `message` is for people. */
export class HttpError extends Error {
  readonly status: number
  readonly code: string
  readonly extra: Record<string, unknown>

  constructor(status: number, code: string, message?: string, extra: Record<string, unknown> = {}) {
    super(message ?? code)
    this.status = status
    this.code = code
    this.extra = extra
  }
}

const NO_STORE = { 'cache-control': 'no-store' }

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...NO_STORE, ...headers },
  })
}

export function redirect(location: string, cookies: string[] = []) {
  const headers = new Headers({ location, ...NO_STORE })
  for (const cookie of cookies) headers.append('set-cookie', cookie)
  return new Response(null, { status: 302, headers })
}

const MAX_BODY = 256 * 1024

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text()
  if (text.length > MAX_BODY) throw new HttpError(413, 'body_too_large')
  let body: unknown
  try {
    body = text ? JSON.parse(text) : {}
  } catch {
    throw new HttpError(400, 'invalid_body')
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'invalid_body')
  return body as Record<string, unknown>
}

export function sha256(text: string) {
  return createHash('sha256').update(text).digest('hex')
}

export function randomToken() {
  return randomBytes(32).toString('base64url')
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function readCookie(request: Request, name: string): string | undefined {
  for (const part of (request.headers.get('cookie') ?? '').split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

/** `__Host-` cookies are HTTPS-only, path-wide and bound to this exact host. */
export function setCookie(name: string, value: string, maxAge: number) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`
}
