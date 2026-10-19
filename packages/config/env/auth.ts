import { authEnvSchema } from "@metriq/types";
import { loadEnv } from "./loader";

export const authEnv = loadEnv(authEnvSchema, "@metriq/auth");
export const env = authEnv;
