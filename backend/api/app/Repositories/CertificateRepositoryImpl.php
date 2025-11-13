<?php

namespace App\Repositories;

use App\Interfaces\CertificateRepositoryInterface;
use App\Models\Certificates\CertificateRequest;
use App\Models\Users\UserProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CertificateRepositoryImpl implements CertificateRepositoryInterface
{

    public function all(array $relations = [], ?int $perPage = null, ?int $userId = null): Collection|LengthAwarePaginator
    {
        $query = CertificateRequest::with($relations)

            ->orderBy('created_at', 'desc');

        if (!is_null($userId) && $userId !== 0) {
            $query->where('user_profile_id', $userId);
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }
    public function findById(int $id, array $relations = []): ?CertificateRequest
    {
        return CertificateRequest::with($relations)->find($id);
    }
    public function createCertificateRequest(array $certificateData, int $profileId): CertificateRequest
    {
        return DB::transaction(function () use ($certificateData, $profileId) {
            $profile = UserProfile::findOrFail($profileId);
            $certificateData['status'] ??= CertificateRequest::STATUS_PENDING;
            $certificateRequest = $profile->certificateRequests()->create($certificateData);
            // optional: eager-load the owner so callers get it back populated
            return $certificateRequest->load('profile');
        });
    }
    public function updateCertificateRequest(CertificateRequest $certificate, array $certificateData): CertificateRequest
    {
        return DB::transaction(function () use ($certificate, $certificateData) {
            $status = $certificateData['status'] ?? null;

            if (
                !in_array($status, [
                    CertificateRequest::STATUS_APPROVED,
                    CertificateRequest::STATUS_REJECTED,
                    CertificateRequest::STATUS_CANCELLED,
                ], true)
            ) {
                throw ValidationException::withMessages([
                    'status' => "Status must only be approved, rejected or cancelled.",
                ]);
            }

            $certificate->status = $status;
            $certificate->save();

            return $certificate->load('profile');
        });
    }
}
