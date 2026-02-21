import { Pool } from 'pg'

export default async function globalSetup(): Promise<void> {
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgresql://trippers:trippers@localhost:5432/trippers'

  const pool = new Pool({ connectionString: databaseUrl })

  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('Database connection confirmed for integration tests')
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw new Error(
      'Integration tests require a running PostgreSQL database. Please run: docker compose up -d',
    )
  } finally {
    await pool.end()
  }
}
