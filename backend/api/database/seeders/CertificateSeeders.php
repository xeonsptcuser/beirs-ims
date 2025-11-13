<?php

namespace Database\Seeders;

use App\Models\Certificates\CertificateRequest;
use App\Models\Users\UserProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CertificateSeeders extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        UserProfile::query()->each(function (UserProfile $userProfile) {
            CertificateRequest::factory()
                ->count(fake()->numberBetween(1, 4))
                ->state(['user_profile_id' => $userProfile->id])
                ->create();
        });
    }
}
