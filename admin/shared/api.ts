import type { FileId } from './collections.js'
import type { FieldErrors } from './validate.js'

// The shapes the browser and the server exchange over /api.

export type Role = 'owner' | 'editor'

export type SessionUser = { login: string; name?: string; avatarUrl?: string; role: Role }
export type SessionResponse = { user: SessionUser; csrfToken: string }

export type RepositoryInfo = {
  kind: 'github' | 'local'
  /** "owner/repo → main", or where the files are on disk. */
  label: string
  /** Where images under frontend-react/public can be previewed from. */
  assetBase: string
}

/** One file as the site would read it, with the changes waiting to be published. */
export type FileState = { data: unknown; hash: string; pending: boolean }
export type ContentResponse = { files: Record<FileId, FileState>; repository: RepositoryInfo }

/**
 * One edit to one panel. `hash` is the file as the editor last saw it: when
 * someone else has changed it since, the server refuses rather than applying
 * an index that may now point at a different entry.
 */
export type ChangeRequest = {
  op: 'create' | 'update' | 'delete' | 'move' | 'set'
  hash: string
  index?: number
  to?: number
  key?: string
  newKey?: string
  flag?: number
  value?: unknown
}
export type ChangeResponse = { fileId: FileId; file: FileState; summary: string }

export type Editor = { login: string; id?: number }

export type PendingEntry = {
  fileId: FileId
  path: string
  summaries: string[]
  editors: Editor[]
  updatedAt: string
  updatedBy: string
  before: string
  after: string
}
export type PendingResponse = { files: PendingEntry[] }
export type PublishResponse = { commit: string; url?: string; files: number }

export type Member = {
  login: string
  role: Role
  name?: string
  avatarUrl?: string
  addedBy?: string
  addedAt?: string
  lastSeenAt?: string
  /** Set by ADMIN_OWNERS in Vercel, so it can't be changed or removed here. */
  locked: boolean
}
export type MembersResponse = { members: Member[] }

export type Activity = { id: number; at: string; login: string; action: string; summary: string }
export type ActivityResponse = { activity: Activity[] }

export type ErrorBody = { error: string; message?: string; errors?: FieldErrors; missing?: string[]; file?: FileState }
