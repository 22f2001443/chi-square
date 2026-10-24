import type { Activity } from '../../shared/api.js'
import type { PendingFile, Session, Store, StoredMember } from './types.js'

/** The Store in memory: for tests and the local dev server. Nothing survives a restart. */
export class MemoryStore implements Store {
  private members = new Map<string, StoredMember>()
  private states = new Map<string, number>()
  private sessions = new Map<string, Session>()
  private pending = new Map<string, PendingFile>()
  private activity: Activity[] = []

  async listMembers() {
    return [...this.members.values()].sort((a, b) => a.login.localeCompare(b.login))
  }

  async findMember(login: string) {
    return this.members.get(login)
  }

  async saveMember({ login, role, addedBy }: { login: string; role: StoredMember['role']; addedBy: string }) {
    const existing = this.members.get(login)
    const member = existing ? { ...existing, role } : { login, role, addedBy, addedAt: new Date().toISOString() }
    this.members.set(login, member)
    return member
  }

  async removeMember(login: string) {
    return this.members.delete(login)
  }

  async touchMember(login: string, profile: { githubId: number; name?: string; avatarUrl?: string }) {
    const member = this.members.get(login)
    if (member) this.members.set(login, { ...member, ...profile, lastSeenAt: new Date().toISOString() })
  }

  async saveOAuthState(stateHash: string, expiresAt: Date) {
    this.states.set(stateHash, expiresAt.getTime())
  }

  async takeOAuthState(stateHash: string) {
    const expiresAt = this.states.get(stateHash)
    this.states.delete(stateHash)
    return expiresAt !== undefined && expiresAt > Date.now()
  }

  async createSession(tokenHash: string, session: Session) {
    this.sessions.set(tokenHash, session)
  }

  async findSession(tokenHash: string) {
    const session = this.sessions.get(tokenHash)
    return session && Date.parse(session.expiresAt) > Date.now() ? session : undefined
  }

  async deleteSession(tokenHash: string) {
    this.sessions.delete(tokenHash)
  }

  async deleteSessionsFor(login: string) {
    for (const [hash, session] of this.sessions) if (session.login === login) this.sessions.delete(hash)
  }

  async listPending() {
    return [...this.pending.values()].sort((a, b) => a.path.localeCompare(b.path))
  }

  async readPending(path: string) {
    return this.pending.get(path)
  }

  async writePending(file: Omit<PendingFile, 'updatedAt'>, expectedHash: string | null) {
    const current = this.pending.get(file.path)
    if ((current?.hash ?? null) !== expectedHash) return false
    this.pending.set(file.path, { ...file, updatedAt: new Date().toISOString() })
    return true
  }

  async deletePending(files: { path: string; hash: string }[]) {
    let count = 0
    for (const { path, hash } of files) {
      if (this.pending.get(path)?.hash === hash) {
        this.pending.delete(path)
        count++
      }
    }
    return count
  }

  async logActivity(entry: { login: string; action: string; summary: string }) {
    this.activity.unshift({ id: this.activity.length + 1, at: new Date().toISOString(), ...entry })
  }

  async listActivity(limit: number) {
    return this.activity.slice(0, limit)
  }
}
