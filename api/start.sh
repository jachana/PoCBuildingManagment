#!/bin/sh
echo "Running database migrations..."
npx prisma migrate deploy

echo "Running database seed..."
npx tsx prisma/seed.ts || echo "Seed already applied or failed (non-fatal)"

echo "Starting API server..."
node dist/index.js
