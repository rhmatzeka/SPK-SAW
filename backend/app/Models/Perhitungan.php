<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perhitungan extends Model
{
    use HasFactory;

    protected $table = 'perhitungan';

    protected $fillable = [
        'nama_sesi',
        'user_id',
        'hasil',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'hasil' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(PerhitunganDetail::class);
    }
}
