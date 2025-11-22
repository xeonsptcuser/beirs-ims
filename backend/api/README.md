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
