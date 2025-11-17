<?php

namespace Database\Factories\Users;

use App\Models\Users\UserProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserProfileFactory extends Factory
{
    protected $model = UserProfile::class;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name' => fake()->lastName(),
            'street_address' => fake()->randomElement([
                'pulang bukid',
                'mabolo 1',
                'mabolo 2',
                'liong',
                'sacred heart',
                'sapang daan',
                'sumbrero',
                'kabulihan',
                'abbra',
                'hiland',
                'tres rosas',
                'ura',
                'tinago a',
                'tinago b',
                'tinago c',
                'battiler',
                'sudlon',
                'cenapro',
                'perez',
                'mayol',
            ]),
            'mobile_number' => fake()->numerify('(+63) 9## ### ####'),
            'date_of_birth' => fake()->date(),
        ];
    }
}
