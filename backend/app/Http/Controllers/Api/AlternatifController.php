<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alternatif;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AlternatifController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(
            Alternatif::withCount('nilaiAlternatif')->orderBy('id')->get(),
            'Data alternatif berhasil dimuat.'
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'foto' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,doc,docx', 'max:2048'],
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('alternatif', 'public');
        }

        $alternatif = Alternatif::create($validated);

        return $this->successResponse($alternatif, 'Alternatif berhasil ditambahkan.', 201);
    }

    public function show(Alternatif $alternatif)
    {
        return $this->successResponse(
            $alternatif->load('nilaiAlternatif.kriteria'),
            'Detail alternatif berhasil dimuat.'
        );
    }

    public function update(Request $request, Alternatif $alternatif)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'foto' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,doc,docx', 'max:2048'],
        ]);

        if ($request->hasFile('foto')) {
            if ($alternatif->foto) {
                Storage::disk('public')->delete($alternatif->foto);
            }

            $validated['foto'] = $request->file('foto')->store('alternatif', 'public');
        }

        $alternatif->update($validated);

        return $this->successResponse($alternatif->fresh(), 'Alternatif berhasil diperbarui.');
    }

    public function destroy(Alternatif $alternatif)
    {
        if ($alternatif->foto) {
            Storage::disk('public')->delete($alternatif->foto);
        }

        $alternatif->delete();

        return $this->successResponse(null, 'Alternatif berhasil dihapus.');
    }
}
