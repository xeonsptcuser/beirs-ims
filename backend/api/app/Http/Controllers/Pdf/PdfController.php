<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\BlotterReport\BlotterReport;
use App\Models\Certificates\CertificateRequest;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    public function certificatePreview($id)
    {
        $certificate = CertificateRequest::with('profile')->findOrFail($id);
        $profile = $certificate->profile;

        $data = [
            'full_name' => $this->formatName($profile?->first_name, $profile?->middle_name, $profile?->last_name),
            'address' => $this->formatAddress($profile?->street_address, $profile?->address_line),
            'date_of_birth' => optional($profile?->date_of_birth)?->format('F j, Y'),
            'cert_request_type' => $certificate->cert_request_type,
            'purpose' => $certificate->cert_request_reason,
            'residency_start' => optional($certificate->start_residency_date)?->format('F j, Y'),
            'residency_end' => optional($certificate->end_residency_date)?->format('F j, Y'),
            'issued_at' => optional($certificate->created_at)?->format('F j, Y'),
            'is_current' => $certificate->is_current,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function blotterPreview($id)
    {
        $report = BlotterReport::with(['profile', 'handler'])->findOrFail($id);
        $profile = $report->profile;

        $data = [
            'case_number' => sprintf('BR-%05d', $report->id),
            'complainant' => $this->formatName($profile?->first_name, $profile?->middle_name, $profile?->last_name),
            'contact' => $profile?->mobile_number,
            'address' => $this->formatAddress($profile?->street_address, $profile?->address_line),
            'incident_title' => $report->incident_title,
            'incident_type' => $report->incident_type,
            'incident_datetime' => optional($report->datetime_of_incident)?->format('F j, Y g:i A'),
            'location' => $report->location,
            'landmark' => $report->landmark,
            'person_involved' => $report->person_involved ?? [],
            'witnesses' => $report->witnesses ?? [],
            'description' => $report->description,
            'remarks' => $report->remarks,
            'handled_by' => $this->formatName(
                $report->handler?->first_name,
                $report->handler?->middle_name,
                $report->handler?->last_name
            ),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    private function formatName(?string $first, ?string $middle, ?string $last): string
    {
        return collect([$first, $middle, $last])
            ->filter(fn($part) => filled($part))
            ->implode(' ');
    }

    private function formatAddress(?string $street, ?string $line): string
    {
        return collect([$street, $line])
            ->filter(fn($part) => filled($part))
            ->implode(', ');
    }
}
