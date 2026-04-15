<?php

namespace Database\Seeders;

use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\NilaiAlternatif;
use Illuminate\Database\Seeder;

class NilaiAlternatifSeeder extends Seeder
{
    public function run(): void
    {
        $alternatives = Alternatif::orderBy('id')->get();
        $criteria = Kriteria::orderBy('id')->get();

        $matrix = [
            'Andi Pratama' => [85, 80, 88, 29, 90],
            'Bunga Lestari' => [78, 85, 84, 27, 88],
            'Cahyo Saputra' => [90, 82, 92, 31, 89],
            'Dina Maharani' => [82, 88, 86, 26, 91],
            'Eko Firmansyah' => [76, 79, 80, 25, 85],
        ];

        foreach ($alternatives as $alternative) {
            foreach ($criteria as $index => $criterion) {
                NilaiAlternatif::updateOrCreate(
                    [
                        'alternatif_id' => $alternative->id,
                        'kriteria_id' => $criterion->id,
                    ],
                    [
                        'nilai' => $matrix[$alternative->nama][$index] ?? 0,
                    ]
                );
            }
        }
    }
}
