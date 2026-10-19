import { apiEnvSchema } from "@metriq/types";
import { loadEnv } from "./loader";

export const apiEnv = loadEnv(apiEnvSchema, "@metriq/api");
export const env = apiEnv;
