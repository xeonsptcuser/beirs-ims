<?php

use App\Http\Controllers\Users\UsersController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth/users')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [UsersController::class, 'index'])->name('users.index');
        Route::get('/{user}', [UsersController::class, 'show'])->name('users.show');
        Route::post('/', [UsersController::class, 'store'])->name('users.store');
        Route::put('/{user}', [UsersController::class, 'update'])->name('users.update');
        Route::patch('/{user}', [UsersController::class, 'update'])->name('users.patch');
        Route::delete('/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
    });
});
