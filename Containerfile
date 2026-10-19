# syntax=docker/dockerfile:1
FROM oven/bun:1.4.3 AS base
WORKDIR /app

# ==============================================================================
# Dependencies Stage
# Copies package manifests and lockfile to maximize Docker layer cache reuse
# ==============================================================================
FROM base AS dependencies
WORKDIR /app

# Copy root manifest and lockfile
COPY package.json bun.lock ./

# Copy all workspace package manifests
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/auth/package.json ./packages/auth/
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

# Install workspace dependencies and purge installer cache to save disk space
RUN bun install --frozen-lockfile && rm -rf ~/.bun/install/cache

# ==============================================================================
# Development Base Stage
# Contains full source code and installed workspace dependencies
# ==============================================================================
FROM dependencies AS dev
WORKDIR /app

# Copy monorepo configuration and source code
COPY turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY apps/web ./apps/web

# ==============================================================================
# Database Migrations Runner Target
# Runs drizzle-kit migrations from @metriq/database
# ==============================================================================
FROM dev AS db-migrate
CMD ["bun", "--filter=@metriq/database", "run", "db:migrate"]

# ==============================================================================
# API Service Target
# ==============================================================================
FROM dev AS api
ENV NODE_ENV=development \
    PORT=3001
EXPOSE 3001
CMD ["bun", "--filter=@metriq/api", "run", "dev"]

# ==============================================================================
# Web Service Target (100% Bun)
# ==============================================================================
FROM dev AS web
ENV NODE_ENV=development \
    PORT=3000
EXPOSE 3000
CMD ["bun", "--filter=web", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
