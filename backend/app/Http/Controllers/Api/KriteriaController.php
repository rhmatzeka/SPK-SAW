<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kriteria;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KriteriaController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse([
            'items' => Kriteria::orderBy('id')->get(),
            'summary' => $this->weightSummary(),
        ], 'Data kriteria berhasil dimuat.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'bobot' => ['required', 'numeric', 'min:0.0001', 'max:1'],
            'jenis' => ['required', Rule::in(['benefit', 'cost'])],
            'keterangan' => ['nullable', 'string'],
        ]);

        $futureTotal = $this->futureWeightTotal((float) $validated['bobot']);

        if ($futureTotal > 1.0000 + 0.0001) {
            return $this->errorResponse('Total bobot tidak boleh melebihi 1.0000.', 422, [
                'bobot' => ['Total bobot setelah penambahan melebihi 1.0000.'],
            ]);
        }

        $kriteria = Kriteria::create($validated);

        return $this->successResponse([
            'item' => $kriteria,
            'summary' => $this->weightSummary(),
        ], $this->weightMessage('Kriteria berhasil ditambahkan.'));
    }

    public function show(Kriteria $kriteria)
    {
        return $this->successResponse($kriteria, 'Detail kriteria berhasil dimuat.');
    }

    public function update(Request $request, Kriteria $kriteria)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'bobot' => ['required', 'numeric', 'min:0.0001', 'max:1'],
            'jenis' => ['required', Rule::in(['benefit', 'cost'])],
            'keterangan' => ['nullable', 'string'],
        ]);

        $futureTotal = $this->futureWeightTotal((float) $validated['bobot'], $kriteria);

        if ($futureTotal > 1.0000 + 0.0001) {
            return $this->errorResponse('Total bobot tidak boleh melebihi 1.0000.', 422, [
                'bobot' => ['Total bobot setelah perubahan melebihi 1.0000.'],
            ]);
        }

        $kriteria->update($validated);

        return $this->successResponse([
            'item' => $kriteria->fresh(),
            'summary' => $this->weightSummary(),
        ], $this->weightMessage('Kriteria berhasil diperbarui.'));
    }

    public function destroy(Kriteria $kriteria)
    {
        $kriteria->delete();

        return $this->successResponse([
            'summary' => $this->weightSummary(),
        ], $this->weightMessage('Kriteria berhasil dihapus.'));
    }

    private function futureWeightTotal(float $bobot, ?Kriteria $ignored = null): float
    {
        $query = Kriteria::query();

        if ($ignored) {
            $query->whereKeyNot($ignored->id);
        }

        return round((float) $query->sum('bobot') + $bobot, 4);
    }

    private function weightSummary(): array
    {
        $total = round((float) Kriteria::sum('bobot'), 4);

        return [
            'total_bobot' => $total,
            'is_valid' => abs($total - 1.0) < 0.0001,
            'target' => 1.0000,
        ];
    }

    private function weightMessage(string $successMessage): string
    {
        $summary = $this->weightSummary();

        if (! $summary['is_valid']) {
            return $successMessage.' Total bobot saat ini '.$summary['total_bobot'].'. Perhitungan SAW hanya bisa dijalankan saat total = 1.0000.';
        }

        return $successMessage;
    }
}
