import { handle, type AppContext, type Misconfigured } from '../server/app.js'
import { productionContext } from '../server/production.js'

// Every /api/* request is rewritten here (see vercel.json); server/app.ts
// routes it. The context is built once per instance and reused.
let context: AppContext | Misconfigured | undefined

function serve(request: Request) {
  context ??= productionContext(process.env)
  return handle(request, context)
}

export const GET = serve
export const POST = serve
export const PATCH = serve
export const DELETE = serve
