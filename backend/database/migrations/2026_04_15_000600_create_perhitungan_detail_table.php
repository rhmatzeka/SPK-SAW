<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perhitungan_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('perhitungan_id')->constrained('perhitungan')->cascadeOnDelete();
            $table->foreignId('alternatif_id')->constrained('alternatif')->cascadeOnDelete();
            $table->decimal('skor', 10, 6);
            $table->unsignedInteger('ranking');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perhitungan_detail');
    }
};
