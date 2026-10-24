import { readFile } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'

// Creates the admin's tables in Neon. Safe to run again.
//   DATABASE_URL=postgres://... npm run db:setup
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('Set DATABASE_URL to the Neon connection string first.')
  process.exit(1)
}

const sql = neon(databaseUrl)
const schema = await readFile(new URL('../server/store/schema.sql', import.meta.url), 'utf8')
const statements = schema
  .split('\n')
  .filter(line => !line.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map(statement => statement.trim())
  .filter(Boolean)

for (const statement of statements) await sql.query(statement)
console.log(`Applied ${statements.length} statements.`)
