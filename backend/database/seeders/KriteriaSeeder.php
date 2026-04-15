<?php

namespace Database\Seeders;

use App\Models\Kriteria;
use Illuminate\Database\Seeder;

class KriteriaSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama' => 'Pengalaman Kerja', 'bobot' => 0.2500, 'jenis' => 'benefit', 'keterangan' => 'Semakin tinggi pengalaman semakin baik.'],
            ['nama' => 'Pendidikan', 'bobot' => 0.2000, 'jenis' => 'benefit', 'keterangan' => 'Jenjang pendidikan terakhir.'],
            ['nama' => 'Tes Kompetensi', 'bobot' => 0.2500, 'jenis' => 'benefit', 'keterangan' => 'Skor tes kemampuan teknis.'],
            ['nama' => 'Usia', 'bobot' => 0.1000, 'jenis' => 'cost', 'keterangan' => 'Semakin kecil usia semakin baik sesuai kebutuhan.'],
            ['nama' => 'Wawancara', 'bobot' => 0.2000, 'jenis' => 'benefit', 'keterangan' => 'Penilaian wawancara akhir.'],
        ];

        foreach ($items as $item) {
            Kriteria::updateOrCreate(['nama' => $item['nama']], $item);
        }
    }
}
