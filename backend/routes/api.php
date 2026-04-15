<?php

use App\Http\Controllers\Api\AlternatifController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\KriteriaController;
use App\Http\Controllers\Api\NilaiController;
use App\Http\Controllers\Api\PerhitunganController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    Route::apiResource('kriteria', KriteriaController::class)->parameters([
        'kriteria' => 'kriteria',
    ]);
    Route::apiResource('alternatif', AlternatifController::class);

    Route::get('/nilai', [NilaiController::class, 'index']);
    Route::put('/nilai/bulk', [NilaiController::class, 'bulkUpsert']);

    Route::get('/perhitungan/latest', [PerhitunganController::class, 'latest']);
    Route::get('/perhitungan/{perhitungan}/export/pdf', [PerhitunganController::class, 'exportPdf']);
    Route::get('/perhitungan/{perhitungan}/export/excel', [PerhitunganController::class, 'exportExcel']);
    Route::apiResource('perhitungan', PerhitunganController::class)->only(['index', 'store', 'show']);
});
