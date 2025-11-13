<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: fn(Application $app) =>
        RateLimiter::for(
            'api',
            function (Request $request) {
                return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
            }
        )
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class
        ]);

        // global middlewares
        $middleware->group('api', [
            ThrottleRequests::class . ':api',
            SubstituteBindings::class,
        ]);
        $middleware->use([
            HandleCors::class,
            TrimStrings::class,
            ConvertEmptyStringsToNull::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Always return JSON for API errors
        $exceptions->shouldRenderJsonWhen(fn() => true);

        $exceptions->dontReport([HttpException::class]);

        // Handle validation errors
        $exceptions->renderable(function (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),   // { field: [msg, ...], ... }
                'status' => 422,
            ], 422);
        });

        // Handle model not found
        $exceptions->renderable(function (ModelNotFoundException $e) {
            return response()->json([
                'error_type' => 'MODEL NOT FOUND',
                'message' => $e->getMessage(),
            ], 404);
        });

        // Handle missing routes
        $exceptions->renderable(function (NotFoundHttpException $e) {
            return response()->json([
                'error_type' => 'ENDPOINT NOT FOUND',
                'message' => $e->getMessage(),
            ], 404);
        });

        // Handle unauthenticated requests
        $exceptions->renderable(function (AuthenticationException $e) {
            return response()->json([
                'error_type' => 'AUTHENTICATION FAILED',
                'message' => $e->getMessage(),
            ], 401);
        });

        // Fallback for all others
        $exceptions->renderable(function (Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        });

    })->create();
