<?php

namespace App\Interfaces;

use App\Models\Users\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UsersRepositoryInterface
{
    public function all(array $relations = [], ?int $perPage = null, ?string $search = null): Collection|LengthAwarePaginator;
    public function findById(int $id, array $relations = []): ?User;
    public function findByEmail(string $email, array $relations = []): ?User;
    public function createWithProfile(array $userData, array $profileData): User;
    public function updateWithProfile(User $user, array $userData, array $profileData): User;
    public function delete(User $user): void;
}
