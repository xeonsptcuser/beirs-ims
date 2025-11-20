<?php

namespace Database\Factories\Address;

use App\Models\Address\BarangayAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BarangayAddress>
 */
class BarangayAddressFactory extends Factory
{
    protected $model = BarangayAddress::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->streetName(),
            'description' => $this->faker->optional()->sentence(8),
            'is_active' => true,
        ];
    }
}
