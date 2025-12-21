import { Hono } from "hono";
import { db } from "./db";
import { usersTable, destinationsTable } from "./db/schema";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/users", async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});

app.get("/destinations", async (c) => {
  const destinations = await db.select().from(destinationsTable);
  return c.json(destinations);
});

export default {
  port: 8000,
  fetch: app.fetch,
};
