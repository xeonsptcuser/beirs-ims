<?php

namespace App\Repositories;

use App\Interfaces\CertificateRepositoryInterface;
use App\Models\Certificates\CertificateRequest;
use App\Models\Users\User;
use App\Models\Users\UserProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CertificateRepositoryImpl implements CertificateRepositoryInterface
{

    public function getAll(array $relations = [], ?int $perPage = null, ?array $statuses = null, ?string $search = null): Collection|LengthAwarePaginator
    {

        $query = CertificateRequest::with($relations)

            ->orderBy('created_at', 'desc');

        if (!empty($statuses)) {
            $query->whereIn('status', $statuses);
        }
        $search = $search ? Str::lower($search) : null;
        if (!empty($search)) {
            $query->where(function ($builder) use ($search) {
                $builder->whereHas('profile', function ($profileQuery) use ($search) {
                    $profileQuery->where(DB::raw("LOWER(CONCAT_WS(' ', first_name, last_name))"), 'like', "%{$search}%")
                        ->orWhere(DB::raw("LOWER(first_name)"), 'like', "%{$search}%")
                        ->orWhere(DB::raw("LOWER(last_name)"), 'like', "%{$search}%");
                })->orWhere(DB::raw('LOWER(cert_request_type)'), 'like', "%{$search}%");
            });
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function getAllById(array $relations = [], ?int $userId = null, ?int $perPage = null, ?array $statuses = null, ?string $search = null): Collection|LengthAwarePaginator
    {
        $query = CertificateRequest::with($relations)
            ->orderBy('created_at', 'desc');

        if (!is_null($userId) && $userId !== 0) {
            $user = User::findOrFail($userId);
            if ($user && $user->role === 'resident') {
                $query->where('user_profile_id', $userId);

            }
        }
        if (!empty($statuses)) {
            $query->whereIn('status', $statuses);
        }

        $search = $search ? Str::lower($search) : null;

        if (!empty($search)) {
            $query->where(function ($builder) use ($search) {
                $builder->whereHas('profile', function ($profileQuery) use ($search) {
                    $profileQuery->where(DB::raw("LOWER(CONCAT_WS(' ', first_name, last_name))"), 'like', "%{$search}%")
                        ->orWhere(DB::raw("LOWER(first_name)"), 'like', "%{$search}%")
                        ->orWhere(DB::raw("LOWER(last_name)"), 'like', "%{$search}%");
                })->orWhere(DB::raw('LOWER(cert_request_type)'), 'like', "%{$search}%");
            });
        }
        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function getById(int $id, array $relations = []): ?CertificateRequest
    {
        return CertificateRequest::with($relations)->find($id);
    }
    public function createCertificateRequest(array $certificateData, int $profileId): CertificateRequest
    {
        return DB::transaction(function () use ($certificateData, $profileId) {
            $profile = UserProfile::findOrFail($profileId);
            $certificateData['status'] ??= CertificateRequest::STATUS_PENDING;
            $certificateRequest = $profile->certificateRequests()->create($certificateData);

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
                    CertificateRequest::STATUS_RELEASED,
                    CertificateRequest::STATUS_DONE,
                ], true)
            ) {
                throw ValidationException::withMessages([
                    'status' => "Status must only be approved, rejected, cancelled or released",
                ]);
            }

            $certificate->status = $status;
            $certificate->handled_by = $certificateData['handled_by'];
            $certificate->save();

            return $certificate->load('profile');
        });
    }
}
