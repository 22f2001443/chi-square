/**
 * The one repository this admin publishes to. It is written here rather than
 * read from a request or an environment variable: nothing the browser sends,
 * and no misconfigured deployment, can aim a commit somewhere else.
 */
export const repository = { owner: '22f2001443', name: 'chi-square' } as const

export type GithubCredentials =
  | { kind: 'token'; token: string }
  | { kind: 'app'; appId: string; installationId: string; privateKey: string }

export type ServerConfig = {
  /** The admin's own origin, as the browser sends it in `Origin`. */
  origin: string
  /** GitHub logins that are always owners, lowercase. */
  owners: readonly string[]
  oauth: { clientId: string; clientSecret: string }
  databaseUrl: string
  github: GithubCredentials
  branch: string
}

type Env = Record<string, string | undefined>

function originOf(value: string | undefined): string | undefined {
  try {
    const url = new URL(value ?? '')
    return url.protocol === 'https:' && url.origin === value ? value : undefined
  } catch {
    return undefined
  }
}

function githubCredentials(env: Env): GithubCredentials | undefined {
  const appId = env.GITHUB_APP_ID?.trim() ?? ''
  const installationId = env.GITHUB_APP_INSTALLATION_ID?.trim() ?? ''
  // A key pasted into a form often arrives with its newlines escaped.
  const privateKey = (env.GITHUB_APP_PRIVATE_KEY ?? '').replace(/\\n/g, '\n').trim()
  if (/^\d+$/.test(appId) && /^\d+$/.test(installationId) && privateKey.includes('PRIVATE KEY')) {
    return { kind: 'app', appId, installationId, privateKey }
  }
  const token = env.GITHUB_TOKEN?.trim()
  return token ? { kind: 'token', token } : undefined
}

/**
 * Reads the deployment's settings. Anything missing or malformed is reported
 * by name and the admin stays shut: there is no partial mode in which, say,
 * signing in works without the member list behind it.
 */
export function readConfig(env: Env): { config: ServerConfig } | { missing: string[] } {
  const missing: string[] = []
  const origin = originOf(env.ADMIN_ORIGIN)
  if (!origin) missing.push('ADMIN_ORIGIN')
  const owners = (env.ADMIN_OWNERS ?? '').split(',').map(login => login.trim().toLowerCase()).filter(Boolean)
  if (!owners.length) missing.push('ADMIN_OWNERS')
  const clientId = env.GITHUB_OAUTH_CLIENT_ID?.trim()
  const clientSecret = env.GITHUB_OAUTH_CLIENT_SECRET?.trim()
  if (!clientId) missing.push('GITHUB_OAUTH_CLIENT_ID')
  if (!clientSecret) missing.push('GITHUB_OAUTH_CLIENT_SECRET')
  const databaseUrl = env.DATABASE_URL?.trim()
  if (!databaseUrl) missing.push('DATABASE_URL')
  const github = githubCredentials(env)
  if (!github) missing.push('GITHUB_TOKEN or GITHUB_APP_*')
  const branch = (env.PUBLISH_BRANCH ?? 'main').trim()
  if (!/^[A-Za-z0-9._/-]{1,100}$/.test(branch) || branch.includes('..')) missing.push('PUBLISH_BRANCH')

  if (missing.length || !origin || !clientId || !clientSecret || !databaseUrl || !github) return { missing }
  return { config: { origin, owners, oauth: { clientId, clientSecret }, databaseUrl, github, branch } }
}
