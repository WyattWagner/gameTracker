#!/bin/sh
set -e

cd "$(dirname "$0")/../apps/api"

echo "Running database migrations..."
npx prisma migrate deploy --schema=prisma/schema.postgres.prisma

if [ "${SEED_ON_START:-false}" = "true" ]; then
  echo "Seeding database..."
  npm run db:seed
fi

echo "Starting API..."
exec node dist/index.js
