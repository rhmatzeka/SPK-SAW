<?php

namespace Database\Seeders;

use App\Models\Alternatif;
use Illuminate\Database\Seeder;

class AlternatifSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama' => 'Andi Pratama', 'deskripsi' => 'Kandidat backend engineer berpengalaman di Laravel dan MySQL.'],
            ['nama' => 'Bunga Lestari', 'deskripsi' => 'Kandidat data analyst dengan kemampuan presentasi yang kuat.'],
            ['nama' => 'Cahyo Saputra', 'deskripsi' => 'Kandidat full-stack dengan pengalaman startup 3 tahun.'],
            ['nama' => 'Dina Maharani', 'deskripsi' => 'Kandidat UI engineer dengan portfolio enterprise.'],
            ['nama' => 'Eko Firmansyah', 'deskripsi' => 'Kandidat mobile developer dengan adaptasi cepat.'],
        ];

        foreach ($items as $item) {
            Alternatif::updateOrCreate(['nama' => $item['nama']], $item);
        }
    }
}
