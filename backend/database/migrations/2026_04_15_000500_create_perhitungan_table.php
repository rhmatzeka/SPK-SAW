<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perhitungan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_sesi');
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->json('hasil');
            $table->string('status')->default('completed');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perhitungan');
    }
};
