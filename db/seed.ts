import { config } from "dotenv";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import {
  airportsTable,
  airlinesTable,
  areasTable,
  destinationsTable,
  hotelsTable,
  reservationEventsTable,
  tourStocksTable,
  toursDetailsTable,
  toursTable,
  usersTable,
} from "./schema";

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
  // 既存のデータを削除（外部キー制約の順序を考慮）
  console.log("Clearing existing data...");
  await db.delete(reservationEventsTable);
  await db.delete(tourStocksTable);
  await db.delete(toursDetailsTable);
  await db.delete(toursTable);
  await db.delete(destinationsTable);
  await db.delete(hotelsTable);
  await db.delete(airlinesTable);
  await db.delete(airportsTable);
  await db.delete(usersTable);
  await db.delete(areasTable);
  
  // エリアデータを投入
  console.log("Seeding areas...");
  const areas = await db
    .insert(areasTable)
    .values([
      { name: "Asia", nameJp: "アジア" },
      { name: "Southeast Asia", nameJp: "東南アジア" },
      { name: "Europe", nameJp: "ヨーロッパ" },
      { name: "North America", nameJp: "北米" },
      { name: "South America", nameJp: "南米" },
      { name: "Africa", nameJp: "アフリカ" },
      { name: "Oceania", nameJp: "オセアニア" },
      { name: "Middle East", nameJp: "中東" },
    ])
    .returning();

  console.log(`Inserted ${areas.length} areas`);

  // 空港データを投入
  console.log("Seeding airports...");
  const airports = await db
    .insert(airportsTable)
    .values([
      { code: "NRT", name: "成田国際空港", city: "成田", country: "日本" },
      { code: "KIX", name: "関西国際空港", city: "大阪", country: "日本" },
      { code: "HND", name: "羽田空港", city: "東京", country: "日本" },
      { code: "CDG", name: "シャルル・ド・ゴール空港", city: "パリ", country: "フランス" },
      { code: "DXB", name: "ドバイ国際空港", city: "ドバイ", country: "UAE" },
    ])
    .returning();

  console.log(`Inserted ${airports.length} airports`);

  // 航空会社データを投入
  console.log("Seeding airlines...");
  const airlines = await db
    .insert(airlinesTable)
    .values([
      {
        code: "JL",
        name: "日本航空",
        country: "日本",
        logoUrl: "https://example.com/logos/jal.png",
      },
      {
        code: "AF",
        name: "エールフランス",
        country: "フランス",
        logoUrl: "https://example.com/logos/airfrance.png",
      },
      {
        code: "NH",
        name: "全日本空輸",
        country: "日本",
        logoUrl: "https://example.com/logos/ana.png",
      },
      {
        code: "EK",
        name: "エミレーツ航空",
        country: "UAE",
        logoUrl: "https://example.com/logos/emirates.png",
      },
    ])
    .returning();

  console.log(`Inserted ${airlines.length} airlines`);

  // ホテルデータを投入
  console.log("Seeding hotels...");
  const hotels = await db
    .insert(hotelsTable)
    .values([
      {
        name: "バリ・リゾート&スパ",
        address: "バリ島, インドネシア",
        starRating: 5,
      },
      {
        name: "パリ・エレガンスホテル",
        address: "パリ, フランス",
        starRating: 4,
      },
      {
        name: "モルディブ・オーバーウォーターリゾート",
        address: "モルディブ",
        starRating: 5,
      },
      {
        name: "京都・伝統旅館",
        address: "京都, 日本",
        starRating: 4,
      },
      {
        name: "サントリーニ・サンセットホテル",
        address: "サントリーニ, ギリシャ",
        starRating: 4,
      },
      {
        name: "ドバイ・ラグジュアリーホテル",
        address: "ドバイ, UAE",
        starRating: 5,
      },
    ])
    .returning();

  console.log(`Inserted ${hotels.length} hotels`);

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
  // エリアのIDを取得
  const asiaId = areas.find((a) => a.name === "Asia")?.id;
  const southeastAsiaId = areas.find((a) => a.name === "Southeast Asia")?.id;
  const europeId = areas.find((a) => a.name === "Europe")?.id;
  const middleEastId = areas.find((a) => a.name === "Middle East")?.id;

  if (!asiaId || !southeastAsiaId || !europeId || !middleEastId) {
    throw new Error("Required areas not found");
  }

  const destinations = await db
    .insert(destinationsTable)
    .values([
      { name: "Bali", nameJp: "バリ島", imageFilename: "bali-beach-sunset.png", areaId: southeastAsiaId },
      { name: "Paris", nameJp: "パリ", imageFilename: "eiffel-tower-paris.png", areaId: europeId },
      { name: "Maldives", nameJp: "モルディブ", imageFilename: "maldives-overwater-bungalows.png", areaId: southeastAsiaId },
      { name: "Kyoto", nameJp: "京都", imageFilename: "kyoto-temple-cherry-blossoms.png", areaId: asiaId },
      { name: "Santorini", nameJp: "サントリーニ", imageFilename: "santorini-white-blue.png", areaId: europeId },
      { name: "Dubai", nameJp: "ドバイ", imageFilename: "dubai-burj-khalifa-skyline.jpg", areaId: middleEastId },
    ])
    .returning();

  console.log(`Inserted ${destinations.length} destinations`);

  // ツアーデータを投入
  console.log("Seeding tours...");
  const baliId = destinations.find((d) => d.name === "Bali")?.id;
  const parisId = destinations.find((d) => d.name === "Paris")?.id;
  const maldivesId = destinations.find((d) => d.name === "Maldives")?.id;
  const kyotoId = destinations.find((d) => d.name === "Kyoto")?.id;
  const santoriniId = destinations.find((d) => d.name === "Santorini")?.id;
  const dubaiId = destinations.find((d) => d.name === "Dubai")?.id;

  if (!baliId || !parisId || !maldivesId || !kyotoId || !santoriniId || !dubaiId) {
    throw new Error("Required destinations not found");
  }

  // 空港IDを取得
  const nrtAirportId = airports.find((a) => a.code === "NRT")?.id;
  const kixAirportId = airports.find((a) => a.code === "KIX")?.id;

  if (!nrtAirportId || !kixAirportId) {
    throw new Error("Required airports not found");
  }

  // 航空会社IDを取得
  const jalId = airlines.find((a) => a.code === "JL")?.id;
  const airFranceId = airlines.find((a) => a.code === "AF")?.id;
  const anaId = airlines.find((a) => a.code === "NH")?.id;
  const emiratesId = airlines.find((a) => a.code === "EK")?.id;

  if (!jalId || !airFranceId || !anaId || !emiratesId) {
    throw new Error("Required airlines not found");
  }

  // ホテルIDを取得（順番に取得）
  const baliHotelId = hotels[0]?.id;
  const parisHotelId = hotels[1]?.id;
  const maldivesHotelId = hotels[2]?.id;
  const kyotoHotelId = hotels[3]?.id;
  const santoriniHotelId = hotels[4]?.id;
  const dubaiHotelId = hotels[5]?.id;

  if (
    !baliHotelId ||
    !parisHotelId ||
    !maldivesHotelId ||
    !kyotoHotelId ||
    !santoriniHotelId ||
    !dubaiHotelId
  ) {
    throw new Error("Required hotels not found");
  }

  const tours = await db
    .insert(toursTable)
    .values([
      {
        destinationId: baliId,
        title: "バリ島リゾート5日間",
        minPriceTaxIncluded: 98000,
        departsAirportId: nrtAirportId,
        days: 4,
        isDirectFlight: true,
        airlinesId: jalId,
        hotelId: baliHotelId,
        thumbnailFileName: "bali-resort.jpg",
      },
      {
        destinationId: parisId,
        title: "パリ・ロマンチック7日間",
        minPriceTaxIncluded: 198000,
        departsAirportId: nrtAirportId,
        days: 6,
        isDirectFlight: false,
        airlinesId: airFranceId,
        hotelId: parisHotelId,
        thumbnailFileName: "paris-romantic.jpg",
      },
      {
        destinationId: maldivesId,
        title: "モルディブ・オーバーウォーター7日間",
        minPriceTaxIncluded: 298000,
        departsAirportId: nrtAirportId,
        days: 6,
        isDirectFlight: true,
        airlinesId: jalId,
        hotelId: maldivesHotelId,
        thumbnailFileName: "maldives-overwater.jpg",
      },
      {
        destinationId: kyotoId,
        title: "京都・古都巡り4日間",
        minPriceTaxIncluded: 68000,
        departsAirportId: kixAirportId,
        days: 3,
        isDirectFlight: true,
        airlinesId: anaId,
        hotelId: kyotoHotelId,
        thumbnailFileName: "kyoto-temple.jpg",
      },
      {
        destinationId: santoriniId,
        title: "サントリーニ・エーゲ海5日間",
        minPriceTaxIncluded: 178000,
        departsAirportId: nrtAirportId,
        days: 4,
        isDirectFlight: false,
        airlinesId: airFranceId,
        hotelId: santoriniHotelId,
        thumbnailFileName: "santorini-sunset.jpg",
      },
      {
        destinationId: dubaiId,
        title: "ドバイ・ラグジュアリー6日間",
        minPriceTaxIncluded: 228000,
        departsAirportId: nrtAirportId,
        days: 5,
        isDirectFlight: true,
        airlinesId: emiratesId,
        hotelId: dubaiHotelId,
        thumbnailFileName: "dubai-luxury.jpg",
      },
    ])
    .returning();

  console.log(`Inserted ${tours.length} tours`);

  // ツアー詳細データを投入
  console.log("Seeding tours details...");
  const toursDetails = await db
    .insert(toursDetailsTable)
    .values(
      tours.map((tour) => ({
        tourId: tour.id,
      }))
    )
    .returning();

  console.log(`Inserted ${toursDetails.length} tour details`);

  // ツアー在庫データを投入
  console.log("Seeding tour stocks...");
  const today = new Date();
  const futureDates: Date[] = [];
  for (let i = 1; i <= 12; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i * 7); // 1週間ごとに未来の日付を生成
    futureDates.push(date);
  }

  const tourStocks = await db
    .insert(tourStocksTable)
    .values(
      tours.flatMap((tour, tourIndex) =>
        futureDates.slice(0, 4).map((date) => ({
          tourId: tour.id,
          eventStartDate: date.toISOString().split("T")[0],
          maxCapacity: 20 + (tourIndex % 3) * 10, // 20, 30, 40のいずれか
        }))
      )
    )
    .returning();

  console.log(`Inserted ${tourStocks.length} tour stocks`);

  // 予約イベントデータを投入
  console.log("Seeding reservation events...");
  const reservationEvents = await db
    .insert(reservationEventsTable)
    .values([
      {
        userId: users[0].id,
        tourStockId: tourStocks[0].id,
        numberOfPeople: 2,
        status: "confirmed",
      },
      {
        userId: users[1].id,
        tourStockId: tourStocks[1].id,
        numberOfPeople: 1,
        status: "confirmed",
      },
      {
        userId: users[2].id,
        tourStockId: tourStocks[2].id,
        numberOfPeople: 3,
        status: "pending",
      },
      {
        userId: users[0].id,
        tourStockId: tourStocks[3].id,
        numberOfPeople: 2,
        status: "confirmed",
      },
    ])
    .returning();

  console.log(`Inserted ${reservationEvents.length} reservation events`);
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

