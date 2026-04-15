<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    use HasFactory;

    protected $table = 'kriteria';

    protected $fillable = [
        'nama',
        'bobot',
        'jenis',
        'keterangan',
    ];

    protected function casts(): array
    {
        return [
            'bobot' => 'decimal:4',
        ];
    }

    public function nilaiAlternatif()
    {
        return $this->hasMany(NilaiAlternatif::class);
    }
}
