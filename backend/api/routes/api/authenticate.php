<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;


/*
 * Public Routes
 * Add api routes accessible by all
 */
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('register', [AuthController::class, 'register'])->name('register');

/*
 * Protected Routes
 * Add api routes accessible only after login here
 */
Route::prefix('auth')->group(function () {

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    });
});
