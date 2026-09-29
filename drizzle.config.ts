import { defineConfig } from "drizzle-kit";

import "dotenv/config";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("Set DATABASE_URL (or DATABASE_URL_UNPOOLED) before running drizzle-kit.");
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
