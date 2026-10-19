import { databaseEnv } from "@metriq/config/env/database";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "./relations";

const pool = new Pool({
  connectionString: databaseEnv.DATABASE_URL,
});

export const db = drizzle({ client: pool, relations });
