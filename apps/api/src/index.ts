import { auth } from "@metriq/auth";
import { env } from "@metriq/config/env";
import { Hono } from "hono";
import { requestId } from "hono/request-id";


const app = new Hono().basePath("/api");

/**
 * ||===========================================||
 * ||              MIDDLEWARE                   ||
 * ||===========================================||
 */

app.use(requestId());

/**
 * ||===========================================||
 * ||                 Routes                    ||
 * ||===========================================||
 */
app.get("/health", (c) => {
  return c.json({ status: "ok" }, 200);
});

app.on(["GET", "POST", "OPTIONS", "PATCH", "DELETE"], "/auth/*", (c) => auth.handler(
  c.req.raw)
);

/**
 * ||===========================================||
 * ||              DOCUMENTATION                ||
 * ||===========================================||
 */

console.log(`
    ╔═══════════════════════════════════════╗
    ║            IDCODE API Server          ║
    ╚═══════════════════════════════════════╝

    🚀 Development server started on port ${env.PORT}

    Commands:
    - start: Start the server
    - dev: Start the server in development mode
    - db:generate: Generate database schema
    - db:push: Push database schema to the database
    - db:studio: Open Drizzle Studio
  `);

Bun.serve({
  fetch: app.fetch,
  port: env.PORT
});
