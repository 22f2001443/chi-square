import type { ErrorBody } from '@shared/api'

export class ApiError extends Error {
  readonly status: number
  readonly body: ErrorBody

  constructor(status: number, body: ErrorBody) {
    super(body.message ?? body.error)
    this.status = status
    this.body = body
  }
}

let csrfToken = ''

/** Set from /api/session; every request that changes something carries it. */
export function setCsrfToken(token: string) {
  csrfToken = token
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const method = init.method ?? 'GET'
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: {
      ...(init.body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(method !== 'GET' ? { 'x-csrf-token': csrfToken } : {}),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  const body = await response.json().catch(() => ({ error: 'unreadable_response', message: `The server answered ${response.status}.` }))
  if (!response.ok) throw new ApiError(response.status, body as ErrorBody)
  return body as T
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.body.message ?? error.body.error
  return error instanceof Error ? error.message : 'Something went wrong.'
}
