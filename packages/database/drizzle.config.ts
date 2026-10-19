import { defineConfig } from "drizzle-kit";
import { databaseEnv } from "@metriq/config/env/database";

export default defineConfig({
  out: "./migrations",
  dialect: "postgresql",
  schema: "./schema/index.ts",
  dbCredentials: {
    url: databaseEnv.DATABASE_URL,
  },
});
