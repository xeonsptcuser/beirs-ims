<?php

namespace Database\Seeders;

use App\Models\Users\User;
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

        User::factory()->admin()->create([
            'email' => 'test@admin.com',
            'password' => 'admin123',
        ]);

        User::factory()->staff()->create([
            'email' => 'test@staff.com',
            'password' => 'staff123',
        ]);

        User::factory()->create([
            'email' => 'test@resident.com',
            'password' => 'resident123',
        ]);
        User::factory()->staff()->count(3)->create();
        User::factory()->count(10)->create();

    }
}
