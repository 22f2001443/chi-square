import type { Member, Role } from '../shared/api.js'
import type { Store } from './store/types.js'

/** The signed-in member a request acts as. */
export type Identity = {
  login: string
  githubId?: number
  name?: string
  avatarUrl?: string
  role: Role
  csrfToken: string
}

export interface Authenticator {
  identify(request: Request): Promise<Identity | null>
  login(request: Request): Promise<Response>
  callback(request: Request): Promise<Response>
  logout(request: Request): Promise<Response>
}

/**
 * Who may sign in, and as what. ADMIN_OWNERS always wins, so the deployment's
 * settings can recover the admin even if every stored owner were removed.
 */
export async function memberFor(store: Store, owners: readonly string[], login: string): Promise<Member | undefined> {
  const key = login.toLowerCase()
  if (owners.includes(key)) return { login: key, role: 'owner', locked: true }
  const stored = await store.findMember(key)
  return stored ? { ...stored, locked: false } : undefined
}
