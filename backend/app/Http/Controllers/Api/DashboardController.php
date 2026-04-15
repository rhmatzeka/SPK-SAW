<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\Perhitungan;
use App\Support\ApiResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $latestCalculation = Perhitungan::with(['details.alternatif', 'user'])->latest()->first();

        return $this->successResponse([
            'stats' => [
                'jumlah_kriteria' => Kriteria::count(),
                'jumlah_alternatif' => Alternatif::count(),
                'jumlah_perhitungan' => Perhitungan::count(),
            ],
            'hasil_terbaru' => $latestCalculation,
            'grafik_terbaru' => collect(data_get($latestCalculation, 'hasil.step_4_ranking', []))->values(),
            'riwayat' => Perhitungan::with(['user', 'details.alternatif'])
                ->latest()
                ->take(10)
                ->get(),
        ], 'Data dashboard berhasil dimuat.');
    }
}
