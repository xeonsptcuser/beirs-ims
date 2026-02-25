<?php

namespace Database\Seeders;

use App\Models\Users\User;
use App\Models\Users\UserProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeders extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->ensureUser(
            email: 'test@admin.com',
            role: 'admin',
            password: 'admin123',
            profile: [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'middle_name' => null,
                'street_address' => null,
                'address_line' => null,
                'mobile_number' => null,
                'date_of_birth' => '1990-01-01',
                'is_active' => true,
            ],
        );

        $this->ensureUser(
            email: 'test@staff.com',
            role: 'staff',
            password: 'staff123',
            profile: [
                'first_name' => 'Staff',
                'last_name' => 'Member',
                'middle_name' => null,
                'street_address' => null,
                'address_line' => null,
                'mobile_number' => null,
                'date_of_birth' => '1990-01-01',
                'is_active' => true,
            ],
        );

    }

    private function ensureUser(string $email, string $role, string $password, array $profile): void
    {
        $user = User::firstWhere('email', $email);

        if (!$user) {
            $profile = UserProfile::create($profile);

            User::create([
                'user_profile_id' => $profile->id,
                'email' => $email,
                'password' => $password,
                'role' => $role,
            ]);

            return;
        }

        $user->update([
            'password' => $password,
            'role' => $role,
        ]);
    }
}
