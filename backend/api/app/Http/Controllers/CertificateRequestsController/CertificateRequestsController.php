<?php

namespace App\Http\Controllers\CertificateRequestsController;

use App\Http\Controllers\Controller;
use App\Interfaces\CertificateRepositoryInterface;
use App\Models\Certificates\CertificateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CertificateRequestsController extends Controller
{
    public function __construct(private readonly CertificateRepositoryInterface $certificate)
    {
    }

    // GET /api/auth/certificates
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page');
        $userId = $request->integer('user_id');
        $certificates = $this->certificate->all(['profile'], $perPage, $userId);

        Log::info('Fetching certificates', ['userId' => $userId]);

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
            'end_residency_date' => ['nullable', 'date'],
            'cert_request_reason' => ['required', 'string']
        ]);

        $certificate = $this->certificate->createCertificateRequest([
            'cert_request_type' => $validated['cert_request_type'],
            'start_residency_date' => $validated['start_residency_date'],
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

    public function update(Request $request, int $id)
    {
        $certificateRequest = CertificateRequest::findOrFail($id, ['profile']);

        $validated = $request->validate([
            'status' => ['required', 'string', 'max:255'],
            'cert_request_reason' => ['required', 'string']
        ]);

        $certificateData = collect($validated)
            ->only(['status', 'cert_request_reason'])
            ->filter(fn($value) => !is_null($value))
            ->toArray();

        $certificate = $this->certificate->updateCertificateRequest($certificateRequest, $certificateData);
        return response()->json([
            'status' => 'success',
            'data' => $certificate
        ]);
    }
}
