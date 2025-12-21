import { config } from "dotenv";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { areasTable, destinationsTable, usersTable } from "./schema";

// .env.localファイルを読み込む
config({ path: resolve(process.cwd(), ".env.local") });

// シード用のデータベース接続を作成
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://trippers:trippers@localhost:5432/trippers";

const pool = new Pool({
  connectionString: databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const db = drizzle({ client: pool, schema });

async function main() {
  // 既存のデータを削除
  console.log("Clearing existing data...");
  await db.delete(destinationsTable);
  await db.delete(usersTable);
  await db.delete(areasTable);
  
  // エリアデータを投入
  console.log("Seeding areas...");
  const areas = await db
    .insert(areasTable)
    .values([
      { name: "アジア", code: "ASIA" },
      { name: "東南アジア", code: "SOUTHEAST_ASIA" },
      { name: "ヨーロッパ", code: "EUROPE" },
      { name: "北米", code: "NORTH_AMERICA" },
      { name: "南米", code: "SOUTH_AMERICA" },
      { name: "アフリカ", code: "AFRICA" },
      { name: "オセアニア", code: "OCEANIA" },
      { name: "中東", code: "MIDDLE_EAST" },
    ])
    .returning();

  console.log(`Inserted ${areas.length} areas`);

  // ユーザーデータを投入
  console.log("Seeding users...");
  const users = await db
    .insert(usersTable)
    .values([
      {
        email: "john.doe@example.com",
        lastName: "Doe",
        firstName: "John",
        gender: "Male",
        dateOfBirth: "1985-05-15",
        location: "New York, USA",
      },
      {
        email: "jane.smith@example.com",
        lastName: "Smith",
        firstName: "Jane",
        gender: "Female",
        dateOfBirth: "1990-09-21",
        location: "Los Angeles, USA",
      },
      {
        email: "alex.jones@example.com",
        lastName: "Jones",
        firstName: "Alex",
        gender: "Non-binary",
        dateOfBirth: "1995-12-03",
        location: "Chicago, USA",
      },
    ])
    .returning();

  console.log(`Inserted ${users.length} users`);

  // 目的地データを投入
  console.log("Seeding destinations...");
  // 東南アジアのIDを取得 (index 1, つまり id=2)
  const southeastAsiaId = areas.find((a) => a.code === "SOUTHEAST_ASIA")?.id;
  const europeId = areas.find((a) => a.code === "EUROPE")?.id;
  const middleEastId = areas.find((a) => a.code === "MIDDLE_EAST")?.id;

  if (!southeastAsiaId || !europeId || !middleEastId) {
    throw new Error("Required areas not found");
  }

  const destinations = await db
    .insert(destinationsTable)
    .values([
      { name: "バリ島", imageFilename: "bali-beach-sunset.png", areaId: southeastAsiaId },
      { name: "パリ", imageFilename: "eiffel-tower-paris.png", areaId: europeId },
      { name: "モルディブ", imageFilename: "maldives-overwater-bungalows.png", areaId: southeastAsiaId },
      { name: "京都", imageFilename: "kyoto-temple-cherry-blossoms.png", areaId: southeastAsiaId },
      { name: "サントリーニ", imageFilename: "santorini-white-blue.png", areaId: europeId },
      { name: "ドバイ", imageFilename: "dubai-burj-khalifa-skyline.jpg", areaId: middleEastId },
    ])
    .returning();

  console.log(`Inserted ${destinations.length} destinations`);
}

main()
  .then(async () => {
    console.log("✅ Seed completed successfully");
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await pool.end();
    process.exit(1);
  });

