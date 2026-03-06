#!/bin/sh
echo "Running database migrations..."

# Resolve any previously failed migrations
npx prisma migrate resolve --applied 0001_init 2>/dev/null || true

# Push schema directly (more reliable than migrate deploy for initial setup)
npx prisma db push --accept-data-loss 2>&1 || echo "db push failed, trying migrate deploy..."
npx prisma migrate deploy 2>&1 || true

echo "Running database seed..."
npx tsx prisma/seed.ts || echo "Seed already applied or failed (non-fatal)"

echo "Starting API server..."
node dist/index.js
