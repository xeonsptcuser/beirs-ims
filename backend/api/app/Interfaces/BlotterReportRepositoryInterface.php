<?php

namespace App\Interfaces;

use App\Models\BlotterReport\BlotterReport;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface BlotterReportRepositoryInterface
{
    public function getAll(): Collection|LengthAwarePaginator;
    public function getAllHandledByStaff(): Collection|LengthAwarePaginator;
    public function getAllById(): Collection|LengthAwarePaginator;
    public function getById(): ?BlotterReport;
    public function createBlotterReport(): BlotterReport;
    public function updateBlotterReport(): BlotterReport;
}
