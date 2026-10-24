import type { Activity, Editor, Role } from '../../shared/api.js'

export type StoredMember = {
  login: string
  role: Role
  githubId?: number
  name?: string
  avatarUrl?: string
  addedBy?: string
  addedAt?: string
  lastSeenAt?: string
}

export type Session = {
  login: string
  githubId?: number
  name?: string
  avatarUrl?: string
  csrfToken: string
  expiresAt: string
}

/** A file changed in the admin and not yet published. */
export type PendingFile = {
  path: string
  text: string
  hash: string
  /** The file's blob in the repository when this batch first changed it. */
  baseSha: string
  summaries: string[]
  editors: Editor[]
  updatedBy: string
  updatedAt: string
}

/**
 * Everything the admin keeps between requests. Neon in production; memory in
 * tests and on the local dev server.
 */
export interface Store {
  listMembers(): Promise<StoredMember[]>
  findMember(login: string): Promise<StoredMember | undefined>
  /** Adds a member, or changes the role of an existing one. */
  saveMember(member: { login: string; role: Role; addedBy: string }): Promise<StoredMember>
  removeMember(login: string): Promise<boolean>
  /** Records who a member turned out to be when they signed in. */
  touchMember(login: string, profile: { githubId: number; name?: string; avatarUrl?: string }): Promise<void>

  saveOAuthState(stateHash: string, expiresAt: Date): Promise<void>
  /** Consumes a sign-in state: true once, if it exists and hasn't expired. */
  takeOAuthState(stateHash: string): Promise<boolean>

  createSession(tokenHash: string, session: Session): Promise<void>
  findSession(tokenHash: string): Promise<Session | undefined>
  deleteSession(tokenHash: string): Promise<void>
  deleteSessionsFor(login: string): Promise<void>

  listPending(): Promise<PendingFile[]>
  readPending(path: string): Promise<PendingFile | undefined>
  /**
   * Writes a file's pending text only if it is still what the caller read:
   * `expectedHash` is the pending text's hash, or null for "nothing pending".
   * Returns false when someone else got there first.
   */
  writePending(file: Omit<PendingFile, 'updatedAt'>, expectedHash: string | null): Promise<boolean>
  /** Drops pending files, each only if its text is still the hash given. */
  deletePending(files: { path: string; hash: string }[]): Promise<number>

  logActivity(entry: { login: string; action: string; summary: string }): Promise<void>
  listActivity(limit: number): Promise<Activity[]>
}
