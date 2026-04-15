<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\NilaiAlternatif;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class NilaiController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $criteria = Kriteria::orderBy('id')->get();
        $alternatives = Alternatif::with(['nilaiAlternatif' => fn ($query) => $query->orderBy('kriteria_id')])
            ->orderBy('id')
            ->get();

        return $this->successResponse([
            'criteria' => $criteria,
            'alternatives' => $alternatives->map(function ($alternative) {
                return [
                    'id' => $alternative->id,
                    'nama' => $alternative->nama,
                    'deskripsi' => $alternative->deskripsi,
                    'foto_url' => $alternative->foto_url,
                    'nilai' => $alternative->nilaiAlternatif->mapWithKeys(fn ($score) => [
                        $score->kriteria_id => [
                            'id' => $score->id,
                            'nilai' => round((float) $score->nilai, 4),
                        ],
                    ]),
                ];
            })->values(),
            'range' => config('spk.value_range'),
        ], 'Matriks keputusan berhasil dimuat.');
    }

    public function bulkUpsert(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.alternatif_id' => ['required', 'integer', 'exists:alternatif,id'],
            'items.*.kriteria_id' => ['required', 'integer', 'exists:kriteria,id'],
            'items.*.nilai' => [
                'required',
                'numeric',
                'min:'.config('spk.value_range.min'),
                'max:'.config('spk.value_range.max'),
            ],
        ]);

        NilaiAlternatif::upsert(
            collect($validated['items'])->map(fn ($item) => [
                'alternatif_id' => $item['alternatif_id'],
                'kriteria_id' => $item['kriteria_id'],
                'nilai' => round((float) $item['nilai'], 4),
                'created_at' => now(),
                'updated_at' => now(),
            ])->all(),
            ['alternatif_id', 'kriteria_id'],
            ['nilai', 'updated_at']
        );

        return $this->successResponse(null, 'Nilai alternatif berhasil disimpan.');
    }
}
