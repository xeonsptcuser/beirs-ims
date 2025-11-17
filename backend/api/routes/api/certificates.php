<?php

use App\Http\Controllers\CertificateRequestsController\CertificateRequestsController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth/certificates')->group(function () {
    $certificateParam = '/{cert}';

    Route::middleware('auth:sanctum')->group(function () use ($certificateParam) {
        Route::get('/all', [CertificateRequestsController::class, 'findAll'])->name('cert.findAll');
        Route::get('/', [CertificateRequestsController::class, 'findAllById'])->name('cert.findAllById');
        Route::get($certificateParam, [CertificateRequestsController::class, 'show'])->name('cert.show');
        Route::post("$certificateParam/create", [CertificateRequestsController::class, 'store'])->name('cert.store');
        Route::match(['put', 'patch'], $certificateParam, [CertificateRequestsController::class, 'update'])->name('cert.update');
    });
});
