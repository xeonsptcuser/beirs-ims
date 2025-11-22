<?php

namespace App\Http\Controllers\CertificateRequests;

use App\Http\Controllers\Controller;
use App\Interfaces\CertificateRepositoryInterface;
use App\Models\Certificates\CertificateRequest;
use App\Notifications\CertificateRequestStatusUpdated;
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
        $search = $request->string('search');
        $statuses = $this->resolveStatuses($request);
        $user = $request->user()?->loadMissing('profile');

        if ($user && $user->role === 'staff') {
            $handlerProfileId = $user->profile?->id;
            $staffStatuses = $this->resolveStaffStatuses($statuses);
            $certificates = $this->certificate->getAllHandledByStaff(['profile', 'handler.user'], $handlerProfileId, $perPage, $staffStatuses, $search);
        } else {
            $certificates = $this->certificate->getAll(['profile', 'handler.user'], $perPage, $statuses, $search);
        }

        return response()->json([
            'status' => 'success',
            'data' => $certificates
        ]);
    }

    public function findAllById(Request $request)
    {
        $perPage = $request->integer('per_page');
        $userId = $request->integer('user_id');
        $search = $request->string('search');
        $statuses = $this->resolveStatuses($request);
        $certificates = $this->certificate->getAllById(['profile', 'handler.user'], $userId, $perPage, $statuses, $search);

        return response()->json([
            'status' => 'success',
            'data' => $certificates
        ]);
    }

    // GET /api/auth/certificates/{id}
    public function show(int $certificateId)
    {
        $certificate = $this->certificate->getById($certificateId, ['profile', 'handler.user']);

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

        $user = $request->user()->loadMissing('profile');
        $handlerProfileId = $user->profile?->id;

        if ($certificateRequest->profile) {
            $certificateRequest->profile->notify(
                new CertificateRequestStatusUpdated($certificateRequest, $user)
            );
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'max:255']
        ]);

        $certificateData = collect($validated)
            ->only(['status'])
            ->filter(fn($value) => !is_null($value))
            ->toArray();
        $certificateData['handled_by'] = $handlerProfileId;

        $certificate = $this->certificate->updateCertificateRequest($certificateRequest, $certificateData);

        return response()->json([
            'status' => 'success',
            'data' => $certificate
        ]);
    }

    private function resolveStatuses(Request $request): ?array
    {
        $statuses = $request->input('statuses');

        if (is_null($statuses)) {
            return null;
        }

        if (is_string($statuses)) {
            $statuses = explode(',', $statuses);
        }

        if (!is_array($statuses)) {
            return null;
        }

        $allowedStatuses = [
            CertificateRequest::STATUS_PENDING,
            CertificateRequest::STATUS_APPROVED,
            CertificateRequest::STATUS_REJECTED,
            CertificateRequest::STATUS_CANCELLED,
            CertificateRequest::STATUS_RELEASED,
            CertificateRequest::STATUS_DONE,
        ];

        $filteredStatuses = array_values(array_unique(array_filter(array_map(
            static fn($status) => is_string($status) ? strtolower(trim($status)) : null,
            $statuses
        ))));

        $validStatuses = array_values(array_intersect($filteredStatuses, $allowedStatuses));

        return !empty($validStatuses) ? $validStatuses : null;
    }

    private function resolveStaffStatuses(?array $statuses): array
    {
        $allowedStatuses = [
            CertificateRequest::STATUS_PENDING,
            CertificateRequest::STATUS_APPROVED,
        ];

        if (is_null($statuses)) {
            return $allowedStatuses;
        }

        $filtered = array_values(array_intersect($statuses, $allowedStatuses));

        return !empty($filtered) ? $filtered : $allowedStatuses;
    }
}
