<?php

namespace Database\Seeders;

use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\NilaiAlternatif;
use App\Models\Perhitungan;
use App\Models\User;
use App\Services\SAWService;
use Illuminate\Database\Seeder;

class PerhitunganSeeder extends Seeder
{
    public function run(): void
    {
        if (Perhitungan::exists()) {
            return;
        }

        $criteria = Kriteria::orderBy('id')->get();
        $alternatives = Alternatif::orderBy('id')->get();
        $scores = NilaiAlternatif::orderBy('alternatif_id')->orderBy('kriteria_id')->get();

        if ($criteria->isEmpty() || $alternatives->isEmpty() || $scores->isEmpty()) {
            return;
        }

        $result = app(SAWService::class)->calculate($criteria, $alternatives, $scores);
        $user = User::where('role', 'admin')->first();

        if (! $user) {
            return;
        }

        $perhitungan = Perhitungan::create([
            'nama_sesi' => 'Seed Perhitungan Awal',
            'user_id' => $user->id,
            'hasil' => $result,
            'status' => 'completed',
        ]);

        $perhitungan->details()->createMany(
            collect($result['step_4_ranking'])->map(fn ($item) => [
                'alternatif_id' => $item['alternatif_id'],
                'skor' => $item['skor'],
                'ranking' => $item['ranking'],
            ])->all()
        );
    }
}
