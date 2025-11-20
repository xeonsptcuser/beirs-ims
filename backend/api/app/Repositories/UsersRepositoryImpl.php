<?php

namespace App\Repositories;

use App\Interfaces\UsersRepositoryInterface;
use App\Models\Users\User;
use App\Models\Users\UserProfile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UsersRepositoryImpl implements UsersRepositoryInterface
{
    public function all(array $relations = [], ?int $perPage = null, ?string $search = null): Collection|LengthAwarePaginator
    {
        $query = User::with($relations)
            ->whereIn('role', ['resident', 'staff'])
            ->orderBy(
                UserProfile::select(DB::raw("LOWER(COALESCE(street_address, ''))"))
                    ->whereColumn('user_profiles.id', 'users.user_profile_id')
            );
        // ->orderBy('created_at', 'desc');

        $search = $search ? Str::lower($search) : null;
        if (!empty($search)) {
            $query->where(function ($builder) use ($search) {
                $builder->whereHas('profile', function ($profileQuery) use ($search) {
                    $profileQuery->where(DB::raw("LOWER(CONCAT_WS(' ', first_name, last_name))"), 'like', "%{$search}%")
                        ->orWhere(DB::raw("LOWER(first_name)"), 'like', "%{$search}%")
                        ->orWhere(DB::raw("LOWER(last_name)"), 'like', "%{$search}%");
                });
            });
        }
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
