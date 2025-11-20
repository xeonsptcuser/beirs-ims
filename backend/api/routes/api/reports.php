<?php

use App\Http\Controllers\BlotterReports\BlotterReportsController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth/blotter-reports')->group(function () {
    $blotterReportParams = '/{id}';

    Route::middleware('auth:sanctum')->group(function () use ($blotterReportParams) {
        Route::get('/all', [BlotterReportsController::class, 'findAll'])->name('bltr.findAll');
        Route::get('/resident', [BlotterReportsController::class, 'findAllById'])->name('bltr.findAllById');
        Route::get($blotterReportParams, [BlotterReportsController::class, 'show'])->name('bltr.fetchById');
        Route::post("$blotterReportParams/create", [BlotterReportsController::class, 'store'])->name('bltr.store');
        Route::match(['put', 'patch'], $blotterReportParams, [BlotterReportsController::class, 'update'])->name('bltr.update');
    });
});
