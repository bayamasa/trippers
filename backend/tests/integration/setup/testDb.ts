import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../../../../db/schema'
import { userAuthTable } from '../../../../db/schema'

const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://trippers:trippers@localhost:5432/trippers'

let pool: Pool | undefined

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  }
  return pool
}

export function getTestDb() {
  return drizzle({ client: getPool(), schema })
}

export async function cleanupUserByEmail(email: string): Promise<void> {
  const db = getTestDb()
  // user_profiles is deleted via ON DELETE CASCADE when user_auth is deleted
  await db.delete(userAuthTable).where(eq(userAuthTable.email, email))
}

export async function closeTestDb(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = undefined
  }
}
