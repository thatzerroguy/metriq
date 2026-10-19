import { databaseEnvSchema } from "@metriq/types";
import { loadEnv } from "./loader";

export const databaseEnv = loadEnv(databaseEnvSchema, "@metriq/database");
export const env = databaseEnv;
