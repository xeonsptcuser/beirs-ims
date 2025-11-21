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
                ->state(function () use ($userProfile) {
                    $isPending = fake()->boolean(80); // ~80% pending
                    return [
                        'user_profile_id' => $userProfile->id,
                        'status' => $isPending
                            ? CertificateRequest::STATUS_PENDING
                            : fake()->randomElement([
                                CertificateRequest::STATUS_APPROVED,
                                CertificateRequest::STATUS_RELEASED,
                            ]),
                    ];
                })
                ->create();
        });
    }
}
