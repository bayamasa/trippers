import { bigserial, date, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

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

export const destinationsTable = pgTable("destinations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  imageFilename: varchar("image_filename", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 6 })
    .notNull()
    .defaultNow(),
});

