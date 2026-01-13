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
npm run migration:run || echo "Migrations already applied or not available"

echo "Starting NestJS application..."
exec node dist/main
