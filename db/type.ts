import { createSelectSchema } from "drizzle-zod";
import {
  areasTable,
  destinationsTable,
  reservationEventsTable,
  tourStocksTable,
  toursDetailsTable,
  toursTable,
  userAuthTable,
  userProfilesTable,
} from "./schema";

// すべてのテーブルのスキーマをexport
export const userAuthSchema = createSelectSchema(userAuthTable);
export const userProfilesSchema = createSelectSchema(userProfilesTable);
export const areasSchema = createSelectSchema(areasTable);
export const destinationsSchema = createSelectSchema(destinationsTable);
export const toursSchema = createSelectSchema(toursTable);
export const toursDetailsSchema = createSelectSchema(toursDetailsTable);
export const tourStocksSchema = createSelectSchema(tourStocksTable);
export const reservationEventsSchema = createSelectSchema(reservationEventsTable);

