import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default('development'),
  PORT: z.coerce.number().default(3000),
  BASE_URL: z.url({message: 'Must be a valid URL', hostname: /^(localhost|([a-z0-9-]+\.)*metriq\.now)$/, protocol: /^https?$/ }),
  DATABASE_URL: z.url({ message: 'Must be a valid URL', protocol: /postgres$/ }),
  BETTER_AUTH_SECRET: z.string({ message: 'Must be a valid secret string' }),
  BETTER_AUTH_API_KEY: z.string({ message: 'Must be a valid API key string' }),
  TERMII_BASE_URL: z.url({ message: 'Must be a valid Termii base URL' }),
  TERMII_API_SECRET: z.string({ message: 'Must be a valid Termii API secret string' }),
  TERMII_SENDER_ID: z.string({ message: 'Must be a valid Termii sender ID string' }),
  PLUNK_API_KEY: z.string({ message: 'Must be a valid Plunk API key string' }),
  PLUNK_SECRET_KEY: z.string({ message: 'Must be a valid Plunk secret key string' }),
  PLUNK_BASE_URL: z.url({ message: 'Must be a valid Plunk base URL' }),
  PLUNK_FROM_EMAIL: z.string({ message: 'Must be a valid Plunk from email string' }),
  // PAYSTACK_SECRET_KEY: z.string({ message: 'Must be a valid Paystack secret key string' }),
  // PAYSTACK_PUBLIC_KEY: z.string({ message: 'Must be a valid Paystack public key string' }),
  PAYSTACK_BASE_URL: z.url({ message: 'Must be a valid Paystack base URL' }),
  REDIS_URL: z.url({ message: 'Must be a valid Redis URL', protocol: /^rediss?$/ }),
});