import { fileURLToPath } from 'node:url'
import type { AppContext } from '../app.js'
import { LocalRepository } from '../content/local.js'
import { ContentService } from '../content/service.js'
import { json } from '../http.js'
import type { Authenticator, Identity } from '../identity.js'
import { MemberService } from '../members.js'
import { MemoryStore } from '../store/memory.js'

const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url))

// Only the Vite dev server loads this file: it is never part of the Vercel
// Function, so this sign-in-free identity can't exist in a deployment.
const LOCAL_USER: Identity = { login: 'local', name: 'Local editor', role: 'owner', csrfToken: 'local' }

const localAuth: Authenticator = {
  identify: async () => LOCAL_USER,
  login: async () => new Response(null, { status: 302, headers: { location: '/' } }),
  callback: async () => new Response(null, { status: 302, headers: { location: '/' } }),
  logout: async () => json({ signedOut: true }),
}

const store = new MemoryStore()

/** The admin on `npm run dev`: the site's files on disk, changes held in memory until published. */
export const localContext: AppContext = {
  auth: localAuth,
  content: new ContentService(new LocalRepository(repositoryRoot), store),
  members: new MemberService(store, [LOCAL_USER.login]),
  store,
  origin: request => `http://${request.headers.get('host')}`,
}
