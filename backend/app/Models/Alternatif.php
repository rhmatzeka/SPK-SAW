<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Alternatif extends Model
{
    use HasFactory;

    protected $table = 'alternatif';

    protected $fillable = [
        'nama',
        'deskripsi',
        'foto',
    ];

    protected $appends = ['foto_url'];

    public function nilaiAlternatif()
    {
        return $this->hasMany(NilaiAlternatif::class);
    }

    public function perhitunganDetail()
    {
        return $this->hasMany(PerhitunganDetail::class);
    }

    public function getFotoUrlAttribute(): ?string
    {
        return $this->foto ? Storage::disk('public')->url($this->foto) : null;
    }
}
