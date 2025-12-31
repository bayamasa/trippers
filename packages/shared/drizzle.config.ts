import { defineConfig } from "drizzle-kit";

// 環境変数が設定されていない場合は、デフォルト値を使用
// 実際の環境では、.env.localファイルからNext.jsが自動的に読み込みます
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://trippers:trippers@localhost:5432/trippers";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});

