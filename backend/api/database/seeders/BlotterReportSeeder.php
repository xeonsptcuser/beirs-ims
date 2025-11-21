<?php

namespace Database\Seeders;

use App\Models\BlotterReport\BlotterReport;
use App\Models\Users\UserProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlotterReportSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $profiles = UserProfile::all();
        if ($profiles->isEmpty()) {
            return;
        }

        $profiles->each(function (UserProfile $profile) use ($profiles) {
            $count = fake()->numberBetween(0, 3);
            if ($count === 0) {
                return;
            }

            BlotterReport::factory()
                ->count($count)
                ->state(function () use ($profile, $profiles) {
                    return [
                        'user_profile_id' => $profile->id,
                        'handled_by' => fake()->boolean(40) ? $profiles->random()->id : null,
                    ];
                })
                ->create();
        });
    }
}
