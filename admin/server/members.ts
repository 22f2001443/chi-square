import type { Member, Role } from '../shared/api.js'
import { HttpError } from './http.js'
import type { Identity } from './identity.js'
import type { Store } from './store/types.js'

// GitHub's own rule for usernames.
const GITHUB_LOGIN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

function requireOwner(identity: Identity) {
  if (identity.role !== 'owner') throw new HttpError(403, 'forbidden', 'Only owners can manage members.')
}

function parseRole(value: unknown): Role {
  if (value !== 'owner' && value !== 'editor') throw new HttpError(422, 'invalid', 'Choose owner or editor.', { errors: { role: 'Choose owner or editor.' } })
  return value
}

/**
 * Club members who may sign in. Owners publish and manage this list; editors
 * edit content and stage changes for an owner to publish.
 */
export class MemberService {
  private store: Store
  private owners: readonly string[]

  constructor(store: Store, owners: readonly string[]) {
    this.store = store
    this.owners = owners
  }

  async list(): Promise<Member[]> {
    const stored = await this.store.listMembers()
    const locked: Member[] = this.owners.map(login => {
      const known = stored.find(member => member.login === login)
      return { ...known, login, role: 'owner', locked: true }
    })
    return [...locked, ...stored.filter(member => !this.owners.includes(member.login)).map(member => ({ ...member, locked: false }))]
  }

  async add(identity: Identity, login: unknown, role: unknown): Promise<Member> {
    requireOwner(identity)
    if (typeof login !== 'string' || !GITHUB_LOGIN.test(login.trim().replace(/^@/, ''))) {
      throw new HttpError(422, 'invalid', 'Enter a GitHub username.', { errors: { login: 'Enter a GitHub username.' } })
    }
    const key = login.trim().replace(/^@/, '').toLowerCase()
    if (this.owners.includes(key)) throw new HttpError(409, 'locked', `${key} is already an owner through ADMIN_OWNERS.`)
    if (await this.store.findMember(key)) throw new HttpError(409, 'exists', `${key} is already a member.`)
    const member = await this.store.saveMember({ login: key, role: parseRole(role), addedBy: identity.login })
    await this.store.logActivity({ login: identity.login, action: 'member', summary: `Added ${key} as ${member.role}` })
    return { ...member, locked: false }
  }

  async setRole(identity: Identity, login: string, role: unknown): Promise<Member> {
    requireOwner(identity)
    const key = this.changeable(identity, login)
    if (!await this.store.findMember(key)) throw new HttpError(404, 'not_found', `${key} is not a member.`)
    const member = await this.store.saveMember({ login: key, role: parseRole(role), addedBy: identity.login })
    await this.store.logActivity({ login: identity.login, action: 'member', summary: `Made ${key} ${member.role}` })
    return { ...member, locked: false }
  }

  async remove(identity: Identity, login: string) {
    requireOwner(identity)
    const key = this.changeable(identity, login)
    if (!await this.store.removeMember(key)) throw new HttpError(404, 'not_found', `${key} is not a member.`)
    // Removal takes effect now, not when their session would have expired.
    await this.store.deleteSessionsFor(key)
    await this.store.logActivity({ login: identity.login, action: 'member', summary: `Removed ${key}` })
    return { removed: key }
  }

  private changeable(identity: Identity, login: string) {
    const key = login.toLowerCase()
    if (this.owners.includes(key)) throw new HttpError(409, 'locked', `${key} is an owner through ADMIN_OWNERS; change that in Vercel.`)
    if (key === identity.login) throw new HttpError(409, 'self', "You can't change your own membership.")
    return key
  }
}
