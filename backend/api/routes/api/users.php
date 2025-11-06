<?php

use App\Http\Controllers\Users\UsersController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/users', [UsersController::class, 'index'])->name('users.index');
        Route::post('/users', [UsersController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UsersController::class, 'update'])->name('users.update');
        Route::patch('/users/{user}', [UsersController::class, 'update'])->name('users.patch');
        Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
    });
});
