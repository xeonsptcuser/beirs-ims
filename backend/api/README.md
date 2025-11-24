# BEIRS API

The BEIRS API powers the Barangay E-Information & Reporting System. It is built on Laravel and exposes the secured endpoints that support the resident, barangay staff, and admin experiences.

## What the API does
- **Authentication & authorization:** Role-based guards secure resident, staff, and admin workflows.
- **Resident services:** Handles registration, profile updates, blotter/case submissions with attachments, and certificate requests.
- **Case & certificate processing:** Supports review, approval, or rejection flows for barangay staff and administrators, including notification dispatch.
- **Reporting:** Provides data needed for analytics such as heatmap-style summaries derived from incident locations.
- **Notifications & audit trails:** Sends status updates (SMS/in-app) and records interaction history for monitoring.

## Key directories
- `app/Http/Controllers` – Request handling for cases, certificates, authentication, and notifications.
- `app/Models` – Eloquent models for users, cases, certificates, and related entities.
- `database/migrations` – Schema definitions for user management, reporting, and request tracking tables.

## Getting started
1. Install dependencies: `composer install`
2. Copy the environment file and set credentials: `cp .env.example .env`
3. Generate the app key: `php artisan key:generate`
4. Run migrations (and seeders if available): `php artisan migrate --seed`
5. Start the API: `php artisan serve`

> Tip: Use dedicated API tokens/guards per role when exercising endpoints during development.

## Environment variables
Use `.env.example` as the source of truth for both local development and Render deployment.

### Local development
- Copy `.env.example` to `.env` and update the Postgres credentials under the _Local development settings_ block if needed.
- Set `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, and `SANCTUM_STATEFUL_DOMAINS` to your Vite dev server URL (default `http://localhost:5173`).
- Run `php artisan key:generate` to populate `APP_KEY`.

### Render deployment
- In Render, create environment variables using the _Render deployment_ block in `.env.example` (Render provides `RENDER_EXTERNAL_URL`, `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, and `DATABASE_URL`).
- Point `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, and `SANCTUM_STATEFUL_DOMAINS` to your Vercel domain so CORS and Sanctum cookies work in production.
- Keep `APP_ENV=production` and `APP_DEBUG=false` for the hosted service.
