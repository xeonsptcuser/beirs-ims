<?php

namespace App\Repositories;

use App\Interfaces\BlotterReportRepositoryInterface;
use App\Models\BlotterReport\BlotterReport;
use Illuminate\Database\Eloquent\Collection;

class BlotterReportRepositoryImpl implements BlotterReportRepositoryInterface
{
    // TODO: ADD ACTUAL LOGIC TO IMPLEMENTATION FILE
    public function getAll(): Collection|LengthAwarePaginator
    {
        return new Collection();
    }
    public function getAllHandledByStaff(): Collection|LengthAwarePaginator
    {
        return new Collection();
    }
    public function getAllById(): Collection|LengthAwarePaginator
    {
        return new Collection();
    }
    public function getById(): ?BlotterReport
    {
        return new BlotterReport();
    }
    public function createBlotterReport(): BlotterReport
    {
        return new BlotterReport();
    }
    public function updateBlotterReport(): BlotterReport
    {
        return new BlotterReport();
    }
}
