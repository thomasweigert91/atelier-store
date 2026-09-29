import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import { serverEnv } from "@/env";

/**
 * Server-side better-auth instance.
 *
 * Auth tables are not defined yet. Once they exist in `src/db/schema`,
 * pass them through as `drizzleAdapter(db, { provider: "pg", schema })`
 * and generate them with `npx @better-auth/cli generate`.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret: serverEnv.betterAuthSecret,
  baseURL: serverEnv.betterAuthUrl,
});

export type Session = typeof auth.$Infer.Session;
