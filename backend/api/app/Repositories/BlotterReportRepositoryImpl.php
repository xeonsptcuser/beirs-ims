<?php

namespace App\Repositories;

use App\Interfaces\BlotterReportRepositoryInterface;
use App\Models\BlotterReport\BlotterReport;
use App\Models\Users\User;
use App\Models\Users\UserProfile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BlotterReportRepositoryImpl implements BlotterReportRepositoryInterface
{
    public function getAll(array $relations = [], ?int $perPage = null, ?array $statuses = null, ?string $search = null): Collection|LengthAwarePaginator
    {

        $query = BlotterReport::with($relations)

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


    public function getAllHandledByStaff(array $relations = [], ?int $handlerProfileId = null, ?int $perPage = null, ?array $statuses = null, ?string $search = null): Collection|LengthAwarePaginator
    {
        $allowedStatuses = [
            BlotterReport::STATUS_PENDING,
            BlotterReport::STATUS_PROCESSING,
            BlotterReport::STATUS_APPROVED,
            BlotterReport::STATUS_REJECTED,
            BlotterReport::STATUS_CANCELLED,
            BlotterReport::STATUS_RELEASED,
            BlotterReport::STATUS_DONE,
        ];

        $defaultStaffStatuses = [
            BlotterReport::STATUS_PENDING,
            BlotterReport::STATUS_PROCESSING,
            BlotterReport::STATUS_APPROVED,
        ];

        $statuses = $statuses ? array_values(array_intersect($statuses, $allowedStatuses)) : $defaultStaffStatuses;

        if (empty($statuses)) {
            $statuses = $defaultStaffStatuses;
        }

        $handlerStatuses = array_values(array_intersect($statuses, [
            BlotterReport::STATUS_PROCESSING,
            BlotterReport::STATUS_APPROVED,
            BlotterReport::STATUS_REJECTED,
            BlotterReport::STATUS_CANCELLED,
            BlotterReport::STATUS_RELEASED,
            BlotterReport::STATUS_DONE,
        ]));
        $includePending = in_array(BlotterReport::STATUS_PENDING, $statuses, true);

        $query = BlotterReport::with($relations)
            ->orderBy('created_at', 'desc')
            ->where(function ($builder) use ($includePending, $handlerStatuses, $handlerProfileId) {
                if (!$includePending && empty($handlerStatuses)) {
                    $builder->whereRaw('1 = 0');
                    return;
                }

                if ($includePending) {
                    $builder->where('status', BlotterReport::STATUS_PENDING);
                }

                if (!empty($handlerStatuses)) {
                    $method = $includePending ? 'orWhere' : 'where';

                    $builder->{$method}(function ($handledQuery) use ($handlerStatuses, $handlerProfileId) {
                        $handledQuery->whereIn('status', $handlerStatuses);

                        if (!is_null($handlerProfileId)) {
                            $handledQuery->where('handled_by', $handlerProfileId);
                        }
                    });
                }
            });

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
        $query = BlotterReport::with($relations)
            ->orderBy('created_at', 'desc');

        if (!is_null($userId) && $userId !== 0) {
            $user = User::findOrFail($userId);
            if ($user && $user->role === 'resident' && $user->user_profile_id) {
                $query->where('user_profile_id', $user->user_profile_id);
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
    public function getById(int $id, array $relations = []): ?BlotterReport
    {
        return BlotterReport::with($relations)->find($id);
    }
    public function createBlotterReport(array $blotterData, int $profileId): BlotterReport
    {
        return DB::transaction(function () use ($blotterData, $profileId) {
            $profile = UserProfile::findOrFail($profileId);
            $blotterData['status'] ??= BlotterReport::STATUS_PENDING;
            $blotterReport = $profile->blotterReport()->create($blotterData);

            return $blotterReport->load(['profile', 'handler']);
        });
    }
    public function updateBlotterReport(BlotterReport $blotterReport, array $blotterReportData): BlotterReport
    {
        return DB::transaction(function () use ($blotterReport, $blotterReportData) {
            $status = $blotterReportData['status'] ?? null;

            if (
                !in_array($status, [
                    BlotterReport::STATUS_APPROVED,
                    BlotterReport::STATUS_PROCESSING,
                    BlotterReport::STATUS_REJECTED,
                    BlotterReport::STATUS_CANCELLED,
                    BlotterReport::STATUS_RELEASED,
                    BlotterReport::STATUS_DONE,
                ], true)
            ) {
                throw ValidationException::withMessages([
                    'status' => "Status must only be approved, processing, rejected, cancelled, released, or done",
                ]);
            }

            $blotterReport->status = $status;
            if (array_key_exists('remarks', $blotterReportData)) {
                $blotterReport->remarks = $blotterReportData['remarks'];
            }
            $blotterReport->handled_by = $blotterReportData['handled_by'];
            $blotterReport->save();

            return $blotterReport->load(['profile', 'handler', 'evidence']);
        });
    }
}
