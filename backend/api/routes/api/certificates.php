<?php

use App\Http\Controllers\CertificateRequestsController\CertificateRequestsController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth/certificates')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [CertificateRequestsController::class, 'index'])->name('users.index');
        Route::get('/{user}', [CertificateRequestsController::class, 'show'])->name('users.show');
        Route::post('/{user}/create', [CertificateRequestsController::class, 'store'])->name('users.store');
        Route::put('/{user}', [CertificateRequestsController::class, 'update'])->name('users.update');
        Route::patch('/{user}', [CertificateRequestsController::class, 'update'])->name('users.patch');
    });
});
