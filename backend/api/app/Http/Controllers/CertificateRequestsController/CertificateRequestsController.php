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
    public function findAll(Request $request)
    {
        $perPage = $request->integer('per_page');
        $certificates = $this->certificate->getAll(['profile'], $perPage);

        return response()->json([
            'status' => 'success',
            'data' => $certificates
        ]);
    }

    public function findAllById(Request $request)
    {
        $perPage = $request->integer('per_page');
        $userId = $request->integer('user_id');
        $certificates = $this->certificate->getAllById(['profile'], $perPage, $userId);

        return response()->json([
            'status' => 'success',
            'data' => $certificates
        ]);
    }

    // GET /api/auth/certificates/{id}
    public function show(int $certificateId)
    {
        $certificate = $this->certificate->getById($certificateId, ['profile']);

        return response()->json([
            'status' => 'success',
            'data' => $certificate
        ]);
    }

    public function store(Request $request, int $profileId)
    {
        // update this to notify all staff that a new certificate is requested by resident with id of $profileId
        // add new field/flag to check if the certificate request is read or unread

        $validated = $request->validate([
            'cert_request_type' => ['required', 'string', 'max:255'],
            'start_residency_date' => ['nullable', 'date'],
            'end_residency_date' => ['nullable', 'date'],
            'cert_request_reason' => ['required', 'string'],
            'is_current' => ['nullable', 'boolean']
        ]);

        $certificate = $this->certificate->createCertificateRequest([
            'cert_request_type' => $validated['cert_request_type'],
            'start_residency_date' => $validated['start_residency_date'],
            'end_residency_date' => $validated['end_residency_date'],
            'cert_request_reason' => $validated['cert_request_reason'],
            'is_current' => $validated['is_current'],

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
        // update this so that when the staff approves or rejects, the resident is notified via sms
        $certificateRequest = $this->certificate->getById($id, []);

        if (is_null($certificateRequest)) {
            abort(404);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'max:255']
        ]);

        $certificateData = collect($validated)
            ->only(['status'])
            ->filter(fn($value) => !is_null($value))
            ->toArray();

        $certificate = $this->certificate->updateCertificateRequest($certificateRequest, $certificateData);
        return response()->json([
            'status' => 'success',
            'data' => $certificate
        ]);
    }
}
