<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'success', 'message' => 'laravel api is running...']);
});

foreach (glob(__DIR__ . '/api/*.php') as $routeFile) {
    require_once $routeFile;
}
