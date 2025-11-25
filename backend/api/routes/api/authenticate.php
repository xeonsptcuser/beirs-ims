<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\OtpController;


/*
 * Public Routes
 * Add api routes accessible by all
 */
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('register', [AuthController::class, 'register'])->name('register');
Route::post('request-otp', [OtpController::class, 'request'])->name('otp.request');
Route::post('verify-otp', [OtpController::class, 'verify'])->name('otp.verify');

/*
 * Protected Routes
 * Add api routes accessible only after login here
 */
Route::prefix('auth')->group(function () {

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::post('/otp/request', [OtpController::class, 'requestForAuthenticated'])->name('auth.otp.request');
        Route::post('/otp/verify', [OtpController::class, 'verifyForAuthenticated'])->name('auth.otp.verify');
    });
});
