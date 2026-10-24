import { neon } from '@neondatabase/serverless'
import type { Activity, Editor } from '../../shared/api.js'
import { HttpError } from '../http.js'
import type { PendingFile, Session, Store, StoredMember } from './types.js'

type Row = Record<string, unknown>
type Query = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Row[]>

const text = (value: unknown) => (value === null || value === undefined ? undefined : String(value))
const time = (value: unknown) => (value instanceof Date ? value.toISOString() : text(value))
const id = (value: unknown) => (value === null || value === undefined ? undefined : Number(value))

function toMember(row: Row): StoredMember {
  return {
    login: String(row.login),
    role: row.role === 'owner' ? 'owner' : 'editor',
    githubId: id(row.github_id),
    name: text(row.name),
    avatarUrl: text(row.avatar_url),
    addedBy: text(row.added_by),
    addedAt: time(row.added_at),
    lastSeenAt: time(row.last_seen_at),
  }
}

function toPending(row: Row): PendingFile {
  return {
    path: String(row.path),
    text: String(row.text),
    hash: String(row.hash),
    baseSha: String(row.base_sha),
    summaries: (row.summaries as string[]) ?? [],
    editors: (row.editors as Editor[]) ?? [],
    updatedBy: String(row.updated_by),
    updatedAt: time(row.updated_at) ?? '',
  }
}

/** The Store in Neon Postgres, over Neon's HTTP driver (one round trip per query). */
export class NeonStore implements Store {
  private sql: Query

  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl)
    // A database that is down or unmigrated is an outage to report, not a crash.
    this.sql = async (strings, ...values) => {
      try {
        return await sql(strings, ...values) as Row[]
      } catch (error) {
        console.error('database_error', error instanceof Error ? error.message : error)
        throw new HttpError(503, 'database_unavailable', 'The database could not be reached.')
      }
    }
  }

  async listMembers() {
    return (await this.sql`select * from admin_members order by login`).map(toMember)
  }

  async findMember(login: string) {
    const [row] = await this.sql`select * from admin_members where login = ${login}`
    return row ? toMember(row) : undefined
  }

  async saveMember({ login, role, addedBy }: { login: string; role: StoredMember['role']; addedBy: string }) {
    const [row] = await this.sql`
      insert into admin_members (login, role, added_by) values (${login}, ${role}, ${addedBy})
      on conflict (login) do update set role = excluded.role
      returning *`
    return toMember(row)
  }

  async removeMember(login: string) {
    return (await this.sql`delete from admin_members where login = ${login} returning login`).length > 0
  }

  async touchMember(login: string, profile: { githubId: number; name?: string; avatarUrl?: string }) {
    await this.sql`
      update admin_members
      set github_id = ${profile.githubId}, name = ${profile.name ?? null}, avatar_url = ${profile.avatarUrl ?? null}, last_seen_at = now()
      where login = ${login}`
  }

  async saveOAuthState(stateHash: string, expiresAt: Date) {
    // Old states are swept on the way in; nothing else reads them.
    await this.sql`delete from admin_oauth_states where expires_at < now()`
    await this.sql`insert into admin_oauth_states (state_hash, expires_at) values (${stateHash}, ${expiresAt.toISOString()})`
  }

  async takeOAuthState(stateHash: string) {
    return (await this.sql`delete from admin_oauth_states where state_hash = ${stateHash} and expires_at > now() returning state_hash`).length > 0
  }

  async createSession(tokenHash: string, session: Session) {
    await this.sql`delete from admin_sessions where expires_at < now()`
    await this.sql`
      insert into admin_sessions (token_hash, login, github_id, name, avatar_url, csrf_token, expires_at)
      values (${tokenHash}, ${session.login}, ${session.githubId ?? null}, ${session.name ?? null}, ${session.avatarUrl ?? null}, ${session.csrfToken}, ${session.expiresAt})`
  }

  async findSession(tokenHash: string) {
    const [row] = await this.sql`select * from admin_sessions where token_hash = ${tokenHash} and expires_at > now()`
    if (!row) return undefined
    return {
      login: String(row.login),
      githubId: id(row.github_id),
      name: text(row.name),
      avatarUrl: text(row.avatar_url),
      csrfToken: String(row.csrf_token),
      expiresAt: time(row.expires_at) ?? '',
    }
  }

  async deleteSession(tokenHash: string) {
    await this.sql`delete from admin_sessions where token_hash = ${tokenHash}`
  }

  async deleteSessionsFor(login: string) {
    await this.sql`delete from admin_sessions where login = ${login}`
  }

  async listPending() {
    return (await this.sql`select * from admin_pending order by path`).map(toPending)
  }

  async readPending(path: string) {
    const [row] = await this.sql`select * from admin_pending where path = ${path}`
    return row ? toPending(row) : undefined
  }

  async writePending(file: Omit<PendingFile, 'updatedAt'>, expectedHash: string | null) {
    const summaries = JSON.stringify(file.summaries)
    const editors = JSON.stringify(file.editors)
    if (expectedHash === null) {
      const rows = await this.sql`
        insert into admin_pending (path, text, hash, base_sha, summaries, editors, updated_by)
        values (${file.path}, ${file.text}, ${file.hash}, ${file.baseSha}, ${summaries}::jsonb, ${editors}::jsonb, ${file.updatedBy})
        on conflict (path) do nothing
        returning path`
      return rows.length > 0
    }
    const rows = await this.sql`
      update admin_pending
      set text = ${file.text}, hash = ${file.hash}, summaries = ${summaries}::jsonb, editors = ${editors}::jsonb,
          updated_by = ${file.updatedBy}, updated_at = now()
      where path = ${file.path} and hash = ${expectedHash}
      returning path`
    return rows.length > 0
  }

  async deletePending(files: { path: string; hash: string }[]) {
    let count = 0
    for (const { path, hash } of files) {
      count += (await this.sql`delete from admin_pending where path = ${path} and hash = ${hash} returning path`).length
    }
    return count
  }

  async logActivity(entry: { login: string; action: string; summary: string }) {
    await this.sql`insert into admin_activity (login, action, summary) values (${entry.login}, ${entry.action}, ${entry.summary})`
  }

  async listActivity(limit: number): Promise<Activity[]> {
    const rows = await this.sql`select * from admin_activity order by id desc limit ${limit}`
    return rows.map(row => ({ id: Number(row.id), at: time(row.at) ?? '', login: String(row.login), action: String(row.action), summary: String(row.summary) }))
  }
}
