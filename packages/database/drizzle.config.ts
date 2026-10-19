import { defineConfig } from "drizzle-kit"
import { env } from "@metriq/config/env"

export default defineConfig({
  out: "./migrations",
  dialect: "postgresql",
  schema: "./schema/index.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  }
});