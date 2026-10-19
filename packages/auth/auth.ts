import { authEnv } from "@metriq/config/env/auth";
import { db } from "@metriq/database";
import { accounts, sessions, users, verifications } from "@metriq/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, lastLoginMethod } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "Metriq",
  basePath: "/api/auth",
  baseURL: authEnv.BASE_URL,
  secret: authEnv.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    transaction: true,
    debugLogs: true,
    usePlural: true,
    schema: {
      users,
      accounts,
      sessions,
      verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  socialProviders: {},
  plugins: [
    admin(),
    lastLoginMethod({
      storeInDatabase: true,
    }),
  ],
});
