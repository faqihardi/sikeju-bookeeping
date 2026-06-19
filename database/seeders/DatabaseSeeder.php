<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@sikeju.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Finance Manager',
            'email' => 'finance@sikeju.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'finance',
        ]);

        User::factory()->create([
            'name' => 'Owner',
            'email' => 'owner@sikeju.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'owner',
        ]);
    }
}
