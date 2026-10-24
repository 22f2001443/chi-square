import { createReadStream, existsSync, statSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin, ViteDevServer } from 'vite'

const publicDir = fileURLToPath(new URL('../../../frontend-react/public', import.meta.url))
const IMAGE_TYPES: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' }

async function toRequest(req: IncomingMessage): Promise<Request> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(key, value)
  const body = chunks.length && req.method !== 'GET' && req.method !== 'HEAD' ? Buffer.concat(chunks) : undefined
  return new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers, body })
}

async function send(res: ServerResponse, response: Response) {
  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))
  res.end(Buffer.from(await response.arrayBuffer()))
}

// The site's images, so previews work without GitHub.
function serveSiteImage(url: string, res: ServerResponse) {
  const relative = normalize(decodeURIComponent(url.slice('/__site/'.length).split('?')[0]))
  const file = join(publicDir, relative)
  if (!file.startsWith(publicDir + sep) || !IMAGE_TYPES[extname(file).toLowerCase()] || !existsSync(file) || !statSync(file).isFile()) {
    res.statusCode = 404
    res.end()
    return
  }
  res.setHeader('content-type', IMAGE_TYPES[extname(file).toLowerCase()])
  createReadStream(file).pipe(res)
}

/**
 * Answers /api on the dev server with the same router the Vercel Function
 * uses, but against the files on disk and an in-memory store, signed in as a
 * local owner. Server code is loaded through Vite, so edits to it apply on the
 * next request.
 */
export function localApi(): Plugin {
  return {
    name: 'chi-square-local-api',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/__site/')) return serveSiteImage(req.url, res)
        if (!req.url?.startsWith('/api/')) return next()
        try {
          const [{ handle }, { localContext }] = await Promise.all([
            server.ssrLoadModule('/server/app.ts'),
            server.ssrLoadModule('/server/dev/context.ts'),
          ])
          await send(res, await handle(await toRequest(req), localContext))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}
