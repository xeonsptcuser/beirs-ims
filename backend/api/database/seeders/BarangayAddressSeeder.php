<?php

namespace Database\Seeders;

use App\Models\Address\BarangayAddress;
use Illuminate\Database\Seeder;

class BarangayAddressSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = [
            'pulang bukid',
            'mabolo 1',
            'mabolo 2',
            'liong',
            'sacred heart',
            'sapang daan',
            'sumbrero',
            'kalubihan',
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
        ];

        foreach ($addresses as $name) {
            BarangayAddress::updateOrCreate(
                ['name' => $name],
                ['description' => null, 'is_active' => true]
            );
        }
    }
}
