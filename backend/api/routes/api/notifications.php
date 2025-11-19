<?php

use App\Http\Controllers\Notifications\NotificationsController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::patch('/notifications/{notification}', [NotificationsController::class, 'markAsRead']);
});
