<?php

namespace App\Interfaces;

use App\Models\Certificates\CertificateRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CertificateRepositoryInterface
{
    public function all(array $relations = [], ?int $perPage = null): Collection|LengthAwarePaginator;
    public function findById(int $id, array $relations = []): ?CertificateRequest;
    public function createCertificateRequest(array $certificateData, int $profileId): CertificateRequest;
    public function updateCertificateRequest(CertificateRequest $certificate, array $certificateData): CertificateRequest;
}
