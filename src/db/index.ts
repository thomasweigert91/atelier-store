import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { serverEnv } from "@/env";
import * as schema from "./schema";

const sql = neon(serverEnv.databaseUrl);

export const db = drizzle(sql, { schema });

export type Database = typeof db;
