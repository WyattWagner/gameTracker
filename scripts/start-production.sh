#!/bin/sh
set -e

cd "$(dirname "$0")/../apps/api"

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Link a PostgreSQL database in Railway/Render."
  exit 1
fi

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "dev-secret-change-me" ]; then
  echo "ERROR: JWT_SECRET must be set to a strong random string in production."
  exit 1
fi

echo "Running database migrations (PostgreSQL)..."
npx prisma migrate deploy --schema=prisma/schema.postgres.prisma

if [ "${SEED_ON_START:-false}" = "true" ]; then
  echo "Seeding database..."
  npx prisma db seed --schema=prisma/schema.postgres.prisma
fi

echo "Starting API on port ${PORT:-3001}..."
exec node dist/index.js
