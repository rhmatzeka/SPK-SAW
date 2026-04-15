<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\NilaiAlternatif;
use App\Models\Perhitungan;
use App\Services\SAWService;
use App\Support\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PerhitunganController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly SAWService $sawService)
    {
    }

    public function index()
    {
        return $this->successResponse(
            Perhitungan::with(['user', 'details.alternatif'])->latest()->get(),
            'Riwayat perhitungan berhasil dimuat.'
        );
    }

    public function latest()
    {
        $perhitungan = Perhitungan::with(['user', 'details.alternatif'])->latest()->first();

        return $this->successResponse($perhitungan, 'Perhitungan terbaru berhasil dimuat.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_sesi' => ['nullable', 'string', 'max:255'],
        ]);

        $criteria = Kriteria::orderBy('id')->get();
        $alternatives = Alternatif::orderBy('id')->get();
        $scores = NilaiAlternatif::orderBy('alternatif_id')->orderBy('kriteria_id')->get();

        if ($criteria->isEmpty() || $alternatives->isEmpty()) {
            return $this->errorResponse('Kriteria dan alternatif harus tersedia sebelum proses SAW dijalankan.', 422);
        }

        if (! $this->sawService->hasValidWeightTotal($criteria)) {
            return $this->errorResponse('Total bobot kriteria harus tepat 1.0000 sebelum proses SAW dijalankan.', 422);
        }

        $expectedScoreCount = $criteria->count() * $alternatives->count();

        if ($scores->count() !== $expectedScoreCount) {
            return $this->errorResponse('Semua alternatif harus memiliki nilai pada setiap kriteria.', 422, [
                'nilai' => ['Matriks keputusan belum lengkap.'],
            ]);
        }

        $result = $this->sawService->calculate($criteria, $alternatives, $scores);

        $perhitungan = DB::transaction(function () use ($request, $validated, $result) {
            $calculation = Perhitungan::create([
                'nama_sesi' => $validated['nama_sesi'] ?: 'Perhitungan '.now()->format('Y-m-d H:i:s'),
                'user_id' => $request->user()->id,
                'hasil' => $result,
                'status' => 'completed',
            ]);

            $calculation->details()->createMany(
                collect($result['step_4_ranking'])->map(fn ($item) => [
                    'alternatif_id' => $item['alternatif_id'],
                    'skor' => $item['skor'],
                    'ranking' => $item['ranking'],
                ])->all()
            );

            return $calculation->load(['user', 'details.alternatif']);
        });

        return $this->successResponse($perhitungan, 'Perhitungan SAW berhasil dijalankan.', 201);
    }

    public function show(Perhitungan $perhitungan)
    {
        return $this->successResponse(
            $perhitungan->load(['user', 'details.alternatif']),
            'Detail perhitungan berhasil dimuat.'
        );
    }

    public function exportPdf(Perhitungan $perhitungan)
    {
        $perhitungan->load(['user', 'details.alternatif']);

        $pdf = Pdf::loadView('exports.perhitungan-pdf', [
            'perhitungan' => $perhitungan,
            'hasil' => $perhitungan->hasil,
        ])->setPaper('a4', 'portrait');

        return $pdf->download('hasil-perhitungan-'.$perhitungan->id.'.pdf');
    }

    public function exportExcel(Perhitungan $perhitungan)
    {
        $perhitungan->load(['user', 'details.alternatif']);

        return response()
            ->view('exports.perhitungan-excel', [
                'perhitungan' => $perhitungan,
                'hasil' => $perhitungan->hasil,
            ])
            ->header('Content-Type', 'application/vnd.ms-excel; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="hasil-perhitungan-'.$perhitungan->id.'.xls"');
    }
}
