import { createPrivateKey, sign } from 'node:crypto'
import { publicRoot } from '../../shared/collections.js'
import { repository, type GithubCredentials } from '../config.js'
import { HttpError } from '../http.js'
import type { CommitFile, CommitResult, RepoFile, Repository } from './repository.js'

const API = 'https://api.github.com'
const TIMEOUT_MS = 10_000

type GraphqlResult<T> = { data?: T; errors?: { message: string; type?: string }[] }

/**
 * The site's repository on GitHub. Reads and the publish commit both go
 * through GraphQL: one query fetches every file with the branch head it was
 * read at, and `createCommitOnBranch` writes all files in one commit that
 * GitHub refuses if the branch has moved since that read.
 */
export class GithubRepository implements Repository {
  private credentials: GithubCredentials
  private branch: string
  private fetchImpl: typeof fetch
  private installationToken?: { value: string; expiresAt: number }

  constructor(credentials: GithubCredentials, branch: string, fetchImpl: typeof fetch = fetch) {
    this.credentials = credentials
    this.branch = branch
    this.fetchImpl = fetchImpl
  }

  info() {
    const ref = this.branch.split('/').map(encodeURIComponent).join('/')
    return {
      kind: 'github' as const,
      label: `${repository.owner}/${repository.name} → ${this.branch}`,
      assetBase: `https://raw.githubusercontent.com/${repository.owner}/${repository.name}/${ref}/${publicRoot}/`,
    }
  }

  async readFiles(paths: readonly string[]) {
    return (await this.readAtHead(paths)).files
  }

  async commit(files: CommitFile[], message: string): Promise<CommitResult> {
    const { head, files: current } = await this.readAtHead(files.map(file => file.path))
    const conflicts = files.filter(file => current[file.path]?.sha !== file.baseSha).map(file => file.path)
    if (conflicts.length) {
      throw new HttpError(409, 'publish_conflict', 'These files changed on GitHub after they were edited here. Discard them and redo the edits.', { paths: conflicts })
    }
    const [headline, ...body] = message.split('\n')
    const result = await this.graphql<{ createCommitOnBranch: { commit: { oid: string; url: string } } }>(
      `mutation Publish($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid url } } }`,
      {
        input: {
          branch: { repositoryNameWithOwner: `${repository.owner}/${repository.name}`, branchName: this.branch },
          expectedHeadOid: head,
          message: { headline, body: body.join('\n').trim() || undefined },
          fileChanges: { additions: files.map(file => ({ path: file.path, contents: Buffer.from(file.text, 'utf8').toString('base64') })) },
        },
      },
      error => (/expected branch to point to|head.*oid/i.test(error) ? new HttpError(409, 'publish_conflict', 'The branch moved while publishing. Try again.') : undefined),
    )
    return { commit: result.createCommitOnBranch.commit.oid, url: result.createCommitOnBranch.commit.url }
  }

  private async readAtHead(paths: readonly string[]) {
    const variables: Record<string, string> = { owner: repository.owner, name: repository.name, ref: `refs/heads/${this.branch}` }
    const fields = paths.map((path, index) => {
      variables[`e${index}`] = `${this.branch}:${path}`
      return `f${index}: object(expression: $e${index}) { ... on Blob { oid text isTruncated } }`
    })
    const declarations = paths.map((_, index) => `$e${index}: String!`).join(', ')
    type Blob = { oid: string; text: string | null; isTruncated: boolean } | null
    type Data = { repository: ({ ref: { target: { oid: string } } | null } & Record<string, Blob>) | null }
    const data = await this.graphql<Data>(
      `query Files($owner: String!, $name: String!, $ref: String!${declarations ? `, ${declarations}` : ''}) {
        repository(owner: $owner, name: $name) { ref(qualifiedName: $ref) { target { oid } } ${fields.join(' ')} }
      }`,
      variables,
    )
    if (!data.repository) throw new HttpError(503, 'github_no_access', `The GitHub credentials can't read ${repository.owner}/${repository.name}.`)
    if (!data.repository.ref) throw new HttpError(503, 'branch_missing', `The branch ${this.branch} doesn't exist.`)
    const files: Record<string, RepoFile> = {}
    paths.forEach((path, index) => {
      const blob = data.repository![`f${index}`] as Blob
      if (!blob || blob.text === null || blob.isTruncated) throw new HttpError(500, 'file_missing', `${path} is missing from ${this.branch}.`)
      files[path] = { text: blob.text, sha: blob.oid }
    })
    return { head: data.repository.ref.target.oid, files }
  }

  private async graphql<T>(query: string, variables: Record<string, unknown>, mapError?: (message: string) => HttpError | undefined): Promise<T> {
    const response = await this.request('/graphql', { method: 'POST', body: JSON.stringify({ query, variables }) })
    const result = await response.json() as GraphqlResult<T>
    if (result.errors?.length) {
      const message = result.errors.map(error => error.message).join('; ')
      throw mapError?.(message) ?? new HttpError(502, 'github_error', `GitHub refused the request: ${message}`)
    }
    if (!result.data) throw new HttpError(502, 'github_error', 'GitHub returned no data.')
    return result.data
  }

  private async request(path: string, init: RequestInit, token?: string) {
    const response = await this.fetchImpl(`${API}${path}`, {
      ...init,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token ?? await this.token()}`,
        'content-type': 'application/json',
        'user-agent': 'chi-square-admin',
        'x-github-api-version': '2022-11-28',
      },
    }).catch(() => {
      throw new HttpError(502, 'github_unavailable', 'GitHub could not be reached.')
    })
    if (response.status === 401) throw new HttpError(503, 'github_unauthorized', 'The GitHub credentials in Vercel are not valid.')
    if (!response.ok) throw new HttpError(502, 'github_error', `GitHub answered ${response.status}.`)
    return response
  }

  private async token(): Promise<string> {
    if (this.credentials.kind === 'token') return this.credentials.token
    if (this.installationToken && this.installationToken.expiresAt > Date.now() + 60_000) return this.installationToken.value
    const response = await this.request(`/app/installations/${this.credentials.installationId}/access_tokens`, { method: 'POST' }, this.appJwt())
    const body = await response.json() as { token: string; expires_at: string }
    this.installationToken = { value: body.token, expiresAt: Date.parse(body.expires_at) }
    return body.token
  }

  // GitHub refuses an app JWT valid for more than ten minutes.
  private appJwt() {
    if (this.credentials.kind !== 'app') throw new Error('not an app')
    const now = Math.floor(Date.now() / 1000)
    const part = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url')
    const unsigned = `${part({ alg: 'RS256', typ: 'JWT' })}.${part({ iat: now - 30, exp: now + 540, iss: this.credentials.appId })}`
    let key
    try {
      key = createPrivateKey(this.credentials.privateKey)
    } catch {
      throw new HttpError(503, 'github_unauthorized', 'GITHUB_APP_PRIVATE_KEY is not a valid PEM key.')
    }
    return `${unsigned}.${sign('RSA-SHA256', Buffer.from(unsigned), key).toString('base64url')}`
  }
}
