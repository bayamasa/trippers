import { createSelectSchema } from "drizzle-zod";
import {
  areasTable,
  destinationsTable,
  reservationEventsTable,
  tourStocksTable,
  toursDetailsTable,
  toursTable,
  usersTable,
} from "./schema";

// すべてのテーブルのスキーマをexport
export const usersSchema = createSelectSchema(usersTable);
export const areasSchema = createSelectSchema(areasTable);
export const destinationsSchema = createSelectSchema(destinationsTable);
export const toursSchema = createSelectSchema(toursTable);
export const toursDetailsSchema = createSelectSchema(toursDetailsTable);
export const tourStocksSchema = createSelectSchema(tourStocksTable);
export const reservationEventsSchema = createSelectSchema(reservationEventsTable);

