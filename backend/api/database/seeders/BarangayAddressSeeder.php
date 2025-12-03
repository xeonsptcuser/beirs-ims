<?php

namespace Database\Seeders;

use App\Models\Address\BarangayAddress;
use Illuminate\Database\Seeder;

class BarangayAddressSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = [
            'sapang-daan',
            'abbra',
            'liong',
            'mabolo',
            'sacred heart',
            'pulang bukid',
            'tres rosas',
            'tinago',
            'sudlon',
            'perez compd.',

        ];

        foreach ($addresses as $name) {
            BarangayAddress::updateOrCreate(
                ['name' => $name],
                ['description' => null, 'is_active' => true]
            );
        }
    }
}
