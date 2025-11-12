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
            'street_address' => fake()->address(),
            'mobile_number' => fake()->phoneNumber(),
            'date_of_birth' => fake()->date(),
        ];
    }
}
