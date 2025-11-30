<?php

use App\Http\Controllers\Heatmaps\HeatmapController;
use Illuminate\Support\Facades\Route;

Route::prefix('heatmaps')->group(function () {
    Route::get('/sections', [HeatmapController::class, 'sections'])->name('heatmaps.sections');
});
