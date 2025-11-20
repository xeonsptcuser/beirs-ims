<?php

use App\Http\Controllers\Addresses\BarangayAddressController;
use Illuminate\Support\Facades\Route;

Route::prefix('addresses')->group(function () {
    Route::get('/', [BarangayAddressController::class, 'index'])->name('addresses.index');
});

Route::prefix('auth/addresses')->middleware('auth:sanctum')->group(function () {
    Route::post('/', [BarangayAddressController::class, 'store'])->name('addresses.store');
    Route::match(['put', 'patch'], '/{address}', [BarangayAddressController::class, 'update'])->name('addresses.update');
    Route::delete('/{address}', [BarangayAddressController::class, 'destroy'])->name('addresses.destroy');
});
