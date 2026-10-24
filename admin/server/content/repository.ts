import type { RepositoryInfo } from '../../shared/api.js'

export type RepoFile = { text: string; sha: string }
export type CommitFile = { path: string; text: string; baseSha: string }
export type CommitResult = { commit: string; url?: string }

/**
 * Where the site's files live and where a publish goes: GitHub in production,
 * the working tree on the local dev server. Paths always come from the
 * registry in shared/collections.ts.
 */
export interface Repository {
  info(): RepositoryInfo
  readFiles(paths: readonly string[]): Promise<Record<string, RepoFile>>
  /**
   * Writes every file in one go, but only if each is still at `baseSha`: a
   * file someone changed outside the admin since it was first edited here is a
   * conflict to resolve, never something to overwrite.
   */
  commit(files: CommitFile[], message: string): Promise<CommitResult>
}
