import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Next.jsのApp Routerでは、サーバーコンポーネントで直接使用できるように
// グローバルな接続プールを使用します
// 開発環境ではホットリロード時に新しい接続プールが作成されるのを防ぐため、
// グローバル変数にキャッシュします
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please create a .env.local file with DATABASE_URL=postgresql://trippers:trippers@localhost:5432/trippers"
    );
  }

  if (globalForDb.pool) {
    return globalForDb.pool;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // 接続プールの設定
    max: 10, // 最大接続数
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.pool = pool;
  }

  return pool;
}

export const db = drizzle({ client: getPool(), schema });

