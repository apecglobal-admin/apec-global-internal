import { Pool } from "pg"

const globalForPool = globalThis as unknown as { pgPool?: Pool }

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

const pool = globalForPool.pgPool ?? new Pool({ connectionString })

if (process.env.NODE_ENV !== "production") {
  globalForPool.pgPool = pool
}

export function getPool() {
  return pool
}

export async function query<T = any>(text: string, params?: any[]) {
  const result = await pool.query<T>(text, params)
  return result.rows
}
