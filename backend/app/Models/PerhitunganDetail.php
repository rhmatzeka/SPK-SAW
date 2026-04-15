<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerhitunganDetail extends Model
{
    use HasFactory;

    protected $table = 'perhitungan_detail';

    protected $fillable = [
        'perhitungan_id',
        'alternatif_id',
        'skor',
        'ranking',
    ];

    protected function casts(): array
    {
        return [
            'skor' => 'decimal:6',
        ];
    }

    public function perhitungan()
    {
        return $this->belongsTo(Perhitungan::class);
    }

    public function alternatif()
    {
        return $this->belongsTo(Alternatif::class);
    }
}
