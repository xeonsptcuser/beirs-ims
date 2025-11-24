#!/usr/bin/env bash
set -e

echo "Running composer install (already done in Dockerfile, but safe)..."
composer install --no-dev --optimize-autoloader

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan migrate:fresh --seed --seeder=BarangayAddressSeeder

echo "Starting Nginx..."
nginx -g "daemon off;"
