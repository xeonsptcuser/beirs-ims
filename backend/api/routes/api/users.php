<?php

use App\Http\Controllers\Users\UsersController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth/users')->group(function () {
    $userParam = '/{user}';
    Route::middleware('auth:sanctum')->group(function () use ($userParam) {
        Route::get('/', [UsersController::class, 'index'])->name('users.index');
        Route::get($userParam, [UsersController::class, 'show'])->name('users.show');
        Route::post('/', [UsersController::class, 'store'])->name('users.store');
        Route::match(['put', 'patch'], $userParam, [UsersController::class, 'update'])->name('users.update');
        Route::delete($userParam, [UsersController::class, 'destroy'])->name('users.destroy');
    });
});
