<?php

use App\Http\Controllers\Pdf\PdfController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/generate-certificate/{id}', [PdfController::class, 'certificatePreview'])->name('cert.preview');
    Route::get('/generate-incident-report/{id}', [PdfController::class, 'blotterPreview'])->name('br.preview');
});
