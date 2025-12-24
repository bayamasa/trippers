import { bigint, bigserial, boolean, date, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const areaCodeEnum = pgEnum("area_code", [
  "ASIA",
  "SOUTHEAST_ASIA",
  "EUROPE",
  "NORTH_AMERICA",
  "SOUTH_AMERICA",
  "AFRICA",
  "OCEANIA",
  "MIDDLE_EAST",
]);

export const usersTable = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 255 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 6 })
    .notNull()
    .defaultNow(),
});

export const areasTable = pgTable("areas", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: areaCodeEnum("code").notNull(),
});

export const airportsTable = pgTable("airports", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
});

export const airlinesTable = pgTable("airlines", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  code: varchar("code", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
});

export const hotelsTable = pgTable("hotels", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  starRating: integer("star_rating").notNull(),
});

export const destinationsTable = pgTable("destinations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  areaId: bigint("area_id", { mode: "number" })
    .notNull()
    .references(() => areasTable.id),
  name: varchar("name", { length: 255 }).notNull(),
  imageFilename: varchar("image_filename", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 6 })
    .notNull()
    .defaultNow(),
});

export const toursTable = pgTable("tours", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  destinationId: bigint("destination_id", { mode: "number" })
    .notNull()
    .references(() => destinationsTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  minPriceTaxIncluded: integer("min_price_tax_included").notNull(),
  departsAirportId: bigint("departs_airport_id", { mode: "number" })
    .notNull()
    .references(() => airportsTable.id),
  days: integer("days").notNull(),
  isDirectFlight: boolean("is_direct_flight").notNull().default(false),
  airlinesId: bigint("airlines_id", { mode: "number" })
    .notNull()
    .references(() => airlinesTable.id),
  hotelId: bigint("hotel_id", { mode: "number" })
    .notNull()
    .references(() => hotelsTable.id),
  thumbnailFileName: varchar("thumbnail_file_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 6 })
    .notNull()
    .defaultNow(),
});

export const toursDetailsTable = pgTable("tours_details", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  tourId: bigint("tour_id", { mode: "number" })
    .notNull()
    .references(() => toursTable.id),
  createdAt: timestamp("created_at", { mode: "date", precision: 6 })
    .notNull()
    .defaultNow(),
});

export const tourStocksTable = pgTable("tour_stocks", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  tourId: bigint("tour_id", { mode: "number" })
    .notNull()
    .references(() => toursTable.id),
  eventStartDate: date("event_start_date").notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 6 })
    .notNull()
    .defaultNow(),
});

export const reservationEventsTable = pgTable("reservation_events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => usersTable.id),
  tourStockId: bigint("tour_stock_id", { mode: "number" })
    .notNull()
    .references(() => tourStocksTable.id),
  numberOfPeople: integer("number_of_people").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { mode: "date", precision: 6 })
    .notNull()
    .defaultNow(),
});

