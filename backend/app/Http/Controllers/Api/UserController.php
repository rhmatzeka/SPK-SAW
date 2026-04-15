<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(User::latest()->get(), 'Daftar user berhasil dimuat.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        $user = User::create($validated);

        return $this->successResponse($user, 'User berhasil ditambahkan.', 201);
    }

    public function show(User $user)
    {
        return $this->successResponse($user, 'Detail user berhasil dimuat.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        if (! $validated['password']) {
            unset($validated['password']);
        }

        $user->update($validated);

        return $this->successResponse($user->fresh(), 'User berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user)
    {
        if ((int) $request->user()->id === (int) $user->id) {
            return $this->errorResponse('Admin tidak dapat menghapus akun yang sedang digunakan.', 422);
        }

        $user->delete();

        return $this->successResponse(null, 'User berhasil dihapus.');
    }
}
