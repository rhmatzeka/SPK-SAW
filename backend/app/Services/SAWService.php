<?php

namespace App\Services;

use Illuminate\Support\Collection;

class SAWService
{
    public function hasValidWeightTotal(Collection $criteria): bool
    {
        return abs((float) $criteria->sum('bobot') - 1.0) < 0.0001;
    }

    public function calculate(Collection $criteria, Collection $alternatives, Collection $scores): array
    {
        $criteria = $criteria->sortBy('id')->values();
        $alternatives = $alternatives->sortBy('id')->values();
        $scoreMap = $scores->keyBy(fn ($item) => $item->alternatif_id.'-'.$item->kriteria_id);

        $decisionMatrix = $alternatives->map(function ($alternative) use ($criteria, $scoreMap) {
            return [
                'alternatif_id' => $alternative->id,
                'alternatif_nama' => $alternative->nama,
                'values' => $criteria->map(function ($criterion) use ($alternative, $scoreMap) {
                    $score = $scoreMap->get($alternative->id.'-'.$criterion->id);

                    return [
                        'kriteria_id' => $criterion->id,
                        'kriteria_nama' => $criterion->nama,
                        'jenis' => $criterion->jenis,
                        'bobot' => round((float) $criterion->bobot, 4),
                        'nilai' => round((float) optional($score)->nilai, 4),
                    ];
                })->values()->all(),
            ];
        })->values();

        $criterionExtremes = $criteria->mapWithKeys(function ($criterion) use ($decisionMatrix) {
            $columnValues = collect($decisionMatrix)
                ->flatMap(fn ($row) => collect($row['values']))
                ->where('kriteria_id', $criterion->id)
                ->pluck('nilai')
                ->map(fn ($value) => (float) $value);

            return [
                $criterion->id => [
                    'max' => (float) $columnValues->max(),
                    'min' => (float) $columnValues->min(),
                ],
            ];
        });

        $normalizedMatrix = collect($decisionMatrix)->map(function ($row) use ($criterionExtremes) {
            return [
                'alternatif_id' => $row['alternatif_id'],
                'alternatif_nama' => $row['alternatif_nama'],
                'values' => collect($row['values'])->map(function ($value) use ($criterionExtremes) {
                    $extreme = $criterionExtremes[$value['kriteria_id']];
                    $rawValue = (float) $value['nilai'];

                    $normalized = $value['jenis'] === 'benefit'
                        ? ($extreme['max'] > 0 ? $rawValue / $extreme['max'] : 0)
                        : ($rawValue > 0 ? $extreme['min'] / $rawValue : 0);

                    return [
                        ...$value,
                        'nilai_normalisasi' => round($normalized, 6),
                    ];
                })->values()->all(),
            ];
        })->values();

        $ranked = $normalizedMatrix->map(function ($row) {
            $score = collect($row['values'])->sum(function ($value) {
                return ((float) $value['bobot']) * ((float) $value['nilai_normalisasi']);
            });

            return [
                'alternatif_id' => $row['alternatif_id'],
                'alternatif_nama' => $row['alternatif_nama'],
                'skor' => round($score, 6),
            ];
        })->sortByDesc('skor')->values()->map(function ($item, $index) {
            return [
                ...$item,
                'ranking' => $index + 1,
            ];
        })->values();

        return [
            'criteria' => $criteria->map(fn ($criterion) => [
                'id' => $criterion->id,
                'nama' => $criterion->nama,
                'bobot' => round((float) $criterion->bobot, 4),
                'jenis' => $criterion->jenis,
                'keterangan' => $criterion->keterangan,
            ])->values()->all(),
            'step_1_matriks_keputusan' => $decisionMatrix->all(),
            'step_2_normalisasi' => $normalizedMatrix->all(),
            'step_3_preferensi' => $ranked->all(),
            'step_4_ranking' => $ranked->all(),
            'ringkasan' => [
                'alternatif_terbaik' => $ranked->first(),
                'jumlah_kriteria' => $criteria->count(),
                'jumlah_alternatif' => $alternatives->count(),
            ],
        ];
    }
}
