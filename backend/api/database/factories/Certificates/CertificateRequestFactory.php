<?php

namespace Database\Factories\Certificates;

use App\Models\Certificates\CertificateRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class CertificateRequestFactory extends Factory
{
    protected $model = CertificateRequest::class;

    public function definition(): array
    {
        return [
            'cert_request_type' => fake()->randomElement([
                'indigency',
                'marriage',
                'clearance',
                'residency',
            ]),
            'start_residency_date' => fake()->date(),
            'end_residency_date' => fake()->date(),
            'cert_request_reason' => fake()->text(200),
            'status' => fake()->randomElement(['pending', 'rejected', 'approved', 'cancelled', 'released', 'done']),
        ];
    }
}
