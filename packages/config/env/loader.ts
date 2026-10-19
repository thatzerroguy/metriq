import fs from "node:fs";
import path from "node:path";
import type { ZodSchema, z } from "zod";

function getInitialDir(): string {
  if (typeof __dirname === "string" && __dirname) {
    return __dirname;
  }
  try {
    if (typeof import.meta !== "undefined") {
      if (typeof import.meta.dirname === "string") return import.meta.dirname;
      if (typeof import.meta.dir === "string") return import.meta.dir;
      if (typeof import.meta.url === "string") {
        return path.dirname(new URL(import.meta.url).pathname);
      }
    }
  } catch {
    // Ignore error in environments where import.meta is restricted
  }
  return process.cwd();
}

/**
 * Searches upwards from the current directory for the root .env file.
 */
function findRootEnv(): string | null {
  let curr = getInitialDir();
  for (let i = 0; i < 7; i++) {
    if (!curr) break;
    const candidate = path.join(curr, ".env");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return null;
}

/**
 * Loads and validates environment variables against a given Zod schema.
 */
export function loadEnv<T extends ZodSchema>(schema: T, packageName = "metriq"): z.infer<T> {
  const envPath = findRootEnv();
  if (envPath && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envPath);
    } catch {
      // Ignored if file cannot be read or already loaded
    }
  }

  const rawEnv: Record<string, string | undefined> = {
    ...(typeof Bun !== "undefined" ? Bun.env : {}),
    ...process.env,
  };

  // Interpolate ${VAR} placeholders if present
  for (const [key, value] of Object.entries(rawEnv)) {
    if (typeof value === "string" && value.includes("${")) {
      rawEnv[key] = value.replace(/\$\{([^}]+)\}/g, (_, k) => rawEnv[k] ?? process.env[k] ?? "");
    }
  }

  const parsed = schema.safeParse(rawEnv);

  if (!parsed.success) {
    console.error(`[${packageName}] Missing or invalid environment variables:`, parsed.error.flatten());
    throw new Error(`[${packageName}] Invalid environment variables`);
  }

  return parsed.data;
}
