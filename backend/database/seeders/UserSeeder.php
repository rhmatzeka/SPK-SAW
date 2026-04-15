<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@spk.test'],
            [
                'name' => 'Administrator SPK',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@spk.test'],
            [
                'name' => 'User SPK',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );
    }
}
