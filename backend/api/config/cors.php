<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => array_filter(
        explode(',', env('CORS_ALLOWED_METHODS', '*')),
        static fn($value) => $value !== ''
    ),
    'allowed_origins' => array_filter(
        explode(',', env('CORS_ALLOWED_ORIGINS', '*')),
        static fn($value) => $value !== ''
    ),
    'allowed_origins_patterns' => array_filter(
        explode(',', env('CORS_ALLOWED_ORIGINS_PATTERNS', '')),
        static fn($value) => $value !== ''
    ),
    'allowed_headers' => array_filter(
        explode(',', env('CORS_ALLOWED_HEADERS', '*')),
        static fn($value) => $value !== ''
    ),
    'exposed_headers' => array_filter(
        explode(',', env('CORS_EXPOSED_HEADERS', '')),
        static fn($value) => $value !== ''
    ),
    'max_age' => (int) env('CORS_MAX_AGE', 0),
    'supports_credentials' => filter_var(
        env('CORS_SUPPORTS_CREDENTIALS', false),
        FILTER_VALIDATE_BOOL,
        FILTER_NULL_ON_FAILURE
    ) ?? false,

];
