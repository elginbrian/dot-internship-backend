#!/bin/sh
set -e

echo "Starting application..."

echo "Waiting for PostgreSQL..."
until nc -z postgres 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is up!"

echo "Running migrations..."
if node scripts/run-migrations.js; then
  echo "Migrations completed successfully"
else
  echo "Migration failed or already applied, continuing..."
fi

echo "Starting NestJS application..."
exec node dist/main
