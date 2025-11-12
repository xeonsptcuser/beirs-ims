<?php

namespace App\Http\Controllers\CertificateRequestsController;

use App\Http\Controllers\Controller;
use App\Interfaces\CertificateRepositoryInterface;
use Illuminate\Http\Request;

class CertificateRequestsController extends Controller
{
    public function __construct(private readonly CertificateRepositoryInterface $certificate)
    {
    }

    // GET /api/auth/certificates
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page');
        $certificates = $this->certificate->all(['profile'], $perPage);

        return response()->json([
            'status' => 'success',
            'data' => $certificates
        ]);
    }

    // GET /api/auth/certificates/{id}
    public function show(int $certificateId)
    {
        $certificate = $this->certificate->findById($certificateId, ['profile']);

        return response()->json([
            'status' => 'success',
            'data' => $certificate
        ]);
    }

    public function store(Request $request, int $profileId)
    {
        $validated = $request->validate([
            'cert_request_type' => ['required', 'string', 'max:255'],
            'start_residency_date' => ['nullable', 'date'],
            'requestor_age' => ['nullable', 'string'],
            'end_residency_date' => ['nullable', 'date'],
            'cert_request_reason' => ['required', 'string']
        ]);

        $certificate = $this->certificate->createCertificateRequest([
            'cert_request_type' => $validated['cert_request_type'],
            'start_residency_date' => $validated['start_residency_date'],
            'requestor_age' => $validated['requestor_age'],
            'end_residency_date' => $validated['end_residency_date'],
            'cert_request_reason' => $validated['cert_request_reason']

        ], $profileId);

        return response()->json(
            [
                'status' => 'success',
                'data' => $certificate
            ]
        );
    }
}
