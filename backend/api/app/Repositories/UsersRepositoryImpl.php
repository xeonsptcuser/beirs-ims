<?php

namespace App\Repositories;

use App\Interfaces\UsersRepositoryInterface;
use App\Models\Users\User;
use App\Models\Users\UserProfile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UsersRepositoryImpl implements UsersRepositoryInterface
{
    public function all(array $relations = [], ?int $perPage = null): Collection|LengthAwarePaginator
    {
        $query = User::with($relations)
            ->whereIn('role', ['resident', 'staff'])
            ->whereHas(
                'profile',
                function ($q) {
                    $q->where('is_active', true);
                }
            )
            ->orderBy('created_at', 'desc');

        return $perPage ? $query->paginate($perPage) : $query->get();
    }
    public function findById(int $id, array $relations = []): ?User
    {
        return User::with($relations)->find($id);
    }

    public function findByEmail(string $email, array $relations = []): ?User
    {
        return User::with($relations)->where('email', $email)->first();
    }

    public function createWithProfile(array $userData, array $profileData): User
    {
        return DB::transaction(function () use ($userData, $profileData) {
            $profileData['is_active'] ??= true;
            $profile = UserProfile::create($profileData);

            $user = $profile->user()->create([
                ...$userData,
            ]);

            return $user->load('profile');
        });
    }

    public function updateWithProfile(User $user, array $userData, array $profileData): User
    {
        return DB::transaction(function () use ($user, $userData, $profileData) {
            $user->profile->update($profileData);
            // Let the User model hash the password via its mutator
            $user->update($userData);

            return $user->load('profile');
        });
    }

    public function delete(User $user): void
    {
        DB::transaction(function () use ($user) {
            if ($user->profile) {
                $user->profile->update(['is_active' => false]);
            }
        });
    }
}
