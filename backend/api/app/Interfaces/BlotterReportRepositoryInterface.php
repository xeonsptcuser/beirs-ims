<?php

namespace App\Interfaces;

use App\Models\BlotterReport\BlotterReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface BlotterReportRepositoryInterface
{
    public function getAll(): Collection|LengthAwarePaginator;
    public function getAllHandledByStaff(array $relations = [], ?int $handlerProfileId = null, ?int $perPage = null, ?array $statuses = null, ?string $search = null): Collection|LengthAwarePaginator;
    public function getAllById(array $relations = [], ?int $userId = null, ?int $perPage = null, ?array $statuses = null, ?string $search = null): Collection|LengthAwarePaginator;
    public function getById(int $id, array $relations = []): ?BlotterReport;
    public function createBlotterReport(array $blotterData, int $profileId): BlotterReport;
    public function updateBlotterReport(BlotterReport $blotterReport, array $blotterReportData): BlotterReport;
}
