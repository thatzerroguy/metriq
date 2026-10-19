import { z } from "zod";

// ============================================================================
// Base Shared Environment Schema
// ============================================================================
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// ============================================================================
// Database Package Schema (@metriq/database)
// ============================================================================
export const databaseEnvSchema = baseEnvSchema.extend({
  DATABASE_URL: z.url({ message: "Must be a valid URL", protocol: /postgres$/ }),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DB: z.string().optional(),
  DB_PORT: z.coerce.number().optional().default(5432),
});

// ============================================================================
// Redis Service Schema
// ============================================================================
export const redisEnvSchema = z.object({
  REDIS_URL: z.url({ message: "Must be a valid Redis URL", protocol: /^rediss?$/ }),
  REDIS_PORT: z.coerce.number().optional().default(6379),
});

// ============================================================================
// Auth Package Schema (@metriq/auth)
// ============================================================================
export const authEnvSchema = z.object({
  BASE_URL: z.url({
    message: "Must be a valid URL",
    hostname: /^(localhost|([a-z0-9-]+\.)*metriq\.now)$/,
    protocol: /^https?$/,
  }),
  BETTER_AUTH_SECRET: z.string({ message: "Must be a valid secret string" }),
  BETTER_AUTH_API_KEY: z.string().optional().or(z.literal("")),
});

// ============================================================================
// API Service Schema (@metriq/api)
// Combines server configs with the packages it consumes
// ============================================================================
export const apiEnvSchema = baseEnvSchema
  .extend({
    PORT: z.coerce.number().default(3001),
    API_PORT: z.coerce.number().optional(),
    RESEND_API_KEY: z.string().optional().or(z.literal("")),
  })
  .merge(databaseEnvSchema)
  .merge(redisEnvSchema)
  .merge(authEnvSchema);

// Backward-compatible alias
export const envSchema = apiEnvSchema;

// Inferred Types
export type BaseEnv = z.infer<typeof baseEnvSchema>;
export type DatabaseEnv = z.infer<typeof databaseEnvSchema>;
export type RedisEnv = z.infer<typeof redisEnvSchema>;
export type AuthEnv = z.infer<typeof authEnvSchema>;
export type ApiEnv = z.infer<typeof apiEnvSchema>;
