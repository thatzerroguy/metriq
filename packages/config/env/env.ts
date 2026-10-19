import { envSchema } from "@metriq/types"

const raw_env = typeof Bun !== "undefined" ? Bun.env : process.env;
const parsed = envSchema.safeParse(raw_env);

if (!parsed.success) {
  console.error("Missing Enviroment variable", parsed.error.flatten())
  throw new Error("Invalid environment variables");
}
export const { data: env } = parsed;