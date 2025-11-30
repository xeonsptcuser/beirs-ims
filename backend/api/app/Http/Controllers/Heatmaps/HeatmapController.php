<?php

namespace App\Http\Controllers\Heatmaps;

use App\Http\Controllers\Controller;
use App\Models\BlotterReport\BlotterReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class HeatmapController extends Controller
{
    private const SECTIONS = [
        'abbra' => 'Sitio Abbra',
        'liong' => 'Sitio Liong',
        'mabolo' => 'Sitio Mabolo',
        'perez' => 'Sitio Perez Compound',
        'pulang-bukid' => 'Sitio Pulang-Bukid',
        'sacred-heart' => 'Sitio Sacred-Heart',
        'sapang-daan' => 'Sitio Sapang-Daan',
        'sudlon' => 'Sitio Sudlon',
        'tinago' => 'Sitio Tinago',
        'tres-rosas' => 'Sitio Tres-Rosas',
    ];

    private const CASE_TYPES = [
        'personal-conflict',
        'noice-disturbance',
        'trespassing',
        'harrasment-threat',
        'physical-injury',
        'vandalism',
        'theft',
        'domestic-dispute',
        'animal-related',
        'curfew-violation',
        'public-disturbance',
        'lost-and-found',
        'brgy-service-complaint',
    ];

    public function sections(): JsonResponse
    {
        $sections = $this->initializeSections();

        BlotterReport::query()
            ->select(['incident_type', 'location', 'landmark'])
            ->orderBy('id')
            ->chunk(500, function ($reports) use (&$sections) {
                foreach ($reports as $report) {
                    $sectionId = $this->matchSection($report->location ?? '', $report->landmark);

                    if (!$sectionId || !isset($sections[$sectionId])) {
                        continue;
                    }

                    $type = Str::of($report->incident_type ?? '')
                        ->lower()
                        ->trim()
                        ->toString();

                    if (!$type || !in_array($type, self::CASE_TYPES, true)) {
                        continue;
                    }

                    $sections[$sectionId]['cases'][$type] = ($sections[$sectionId]['cases'][$type] ?? 0) + 1;
                }
            });

        return response()->json([
            'status' => 'success',
            'data' => array_values($sections),
        ]);
    }

    private function initializeSections(): array
    {
        $casesTemplate = array_fill_keys(self::CASE_TYPES, 0);

        $sections = [];
        foreach (self::SECTIONS as $id => $name) {
            $sections[$id] = [
                'id' => $id,
                'name' => $name,
                'cases' => $casesTemplate,
            ];
        }

        return $sections;
    }

    private function matchSection(?string $location, ?string $landmark = null): ?string
    {
        $haystack = Str::lower(trim($location . ' ' . ($landmark ?? '')));

        foreach (self::SECTIONS as $id => $name) {
            $normalizedName = Str::lower($name);
            $keyword = Str::lower(Str::after($name, 'Sitio '));

            if (Str::contains($haystack, $normalizedName) || Str::contains($haystack, $keyword)) {
                return $id;
            }
        }

        return null;
    }
}
