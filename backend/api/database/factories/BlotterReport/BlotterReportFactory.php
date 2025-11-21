<?php

namespace Database\Factories\BlotterReport;

use App\Models\BlotterReport\BlotterReport;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlotterReportFactory extends Factory
{
    protected $model = BlotterReport::class;

    public function definition(): array
    {
        $incidentDateTime = $this->faker->dateTimeBetween('-1 year', 'now');

        $buildNames = function (int $max) {
            $count = rand(0, $max);
            if ($count === 0) {
                return [];
            }

            return collect(range(1, $count))->map(fn() => fake()->name())->toArray();
        };

        return [
            'incident_type' => $this->faker->randomElement(['theft', 'assault', 'vandalism', 'dispute', 'disturbance']),
            'incident_title' => $this->faker->sentence(4),
            'datetime_of_incident' => $incidentDateTime,
            'location' => $this->faker->streetAddress(),
            'landmark' => $this->faker->optional()->streetName(),
            'person_involved' => $buildNames(3),
            'witnesses' => $buildNames(2),
            'description' => $this->faker->paragraph(),
            'remarks' => $this->faker->optional()->sentence(),
            'status' => $this->faker->randomElement([
                BlotterReport::STATUS_PENDING,
                BlotterReport::STATUS_PROCESSING,
                BlotterReport::STATUS_APPROVED,
                BlotterReport::STATUS_RELEASED,
                BlotterReport::STATUS_DONE,
                BlotterReport::STATUS_REJECTED,
                BlotterReport::STATUS_CANCELLED,
            ]),
            'handled_by' => null,
        ];
    }
}
