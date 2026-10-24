import type { AppContext, Misconfigured } from './app.js'
import { GithubAuthenticator } from './auth/github.js'
import { readConfig } from './config.js'
import { GithubRepository } from './content/github.js'
import { ContentService } from './content/service.js'
import { MemberService } from './members.js'
import { NeonStore } from './store/neon.js'

/** The deployed admin: GitHub sign-in, Neon, and commits to the site's repository. */
export function productionContext(env: Record<string, string | undefined>): AppContext | Misconfigured {
  const result = readConfig(env)
  if ('missing' in result) return result
  const { config } = result
  const store = new NeonStore(config.databaseUrl)
  return {
    auth: new GithubAuthenticator({ store, owners: config.owners, origin: config.origin, clientId: config.oauth.clientId, clientSecret: config.oauth.clientSecret }),
    content: new ContentService(new GithubRepository(config.github, config.branch), store),
    members: new MemberService(store, config.owners),
    store,
    origin: () => config.origin,
  }
}
