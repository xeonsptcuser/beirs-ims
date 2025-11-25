<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Interfaces\UsersRepositoryInterface;
use App\Models\Users\UserProfile;
use App\Services\SupabaseStorageService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    public function __construct(private readonly UsersRepositoryInterface $users, private readonly SupabaseStorageService $storage)
    {
    }

    // GET /api/auth/users
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page');
        $search = $this->resolveSearch($request);
        $sort = $request->filled('sort') ? $request->string('sort')->lower()->value() : null;
        $users = $this->withGovernmentIdUrls(
            $this->users->all(['profile.governmentIdentity'], $perPage, $search, $sort)
        );

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    // GET /api/auth/users/{id}
    public function show(int $userId)
    {
        $user = $this->withGovernmentIdUrls(
            $this->users->findById($userId, ['profile.governmentIdentity'])
        );

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    // POST /api/auth/users/
    public function store(Request $request)
    {
        $legalAgeDate = Carbon::now()->subYears(18)->toDateString();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(['admin', 'staff', 'resident'])],
            'date_of_birth' => ['required', 'date', "before_or_equal:{$legalAgeDate}"],
            'street_address' => ['required', 'string', 'max:255'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'mobile_number' => ['nullable', 'string', 'max:20'],
        ]);

        $user = $this->users->createWithProfile(
            [
                'email' => $validated['email'],
                'password' => $validated['password'] ?? $validated['role'],
                'role' => $validated['role']
            ],
            [

                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'date_of_birth' => Carbon::parse($validated['date_of_birth']),
                'street_address' => $validated['street_address'],
                'address_line' => $validated['address_line'] ?? null,
                'mobile_number' => $validated['mobile_number'] ?? null,

            ]
        );
        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully.',
            'data' => $user,
        ], 201);
    }

    // PUT /api/auth/users/{id}
    public function update(Request $request, $id)
    {
        $user = $this->users->findById($id, ['profile.governmentIdentity']);

        if (!$user) {
            throw new ModelNotFoundException("User {$id} not found");
        }

        $legalAgeDate = Carbon::now()->subYears(18)->toDateString();

        $validated = $request->validate([
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['sometimes', Rule::in(['admin', 'staff', 'resident'])],
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'middle_name' => ['sometimes', 'string', 'max:100'],
            'street_address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address_line' => ['sometimes', 'nullable', 'string', 'max:255'],
            'mobile_number' => ['sometimes', 'nullable', 'string', 'max:20'],
            'date_of_birth' => ['sometimes', 'date', "before_or_equal:{$legalAgeDate}"],
            'is_active' => ['sometimes', 'boolean'],
            'government_identity_type' => ['sometimes', 'string', 'max:255'],
            'government_identity' => ['sometimes', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $userData = collect($validated)
            ->only(['email', 'password', 'role'])
            ->filter(fn($value) => !is_null($value))
            ->toArray();

        $profileData = collect($validated)
            ->only(['first_name', 'last_name', 'middle_name', 'street_address', 'address_line', 'mobile_number', 'date_of_birth', 'is_active'])
            ->filter(fn($value) => !is_null($value))
            ->toArray();

        if (array_key_exists('mobile_number', $profileData) && $profileData['mobile_number'] !== $user->profile->mobile_number) {
            $profileData['mobile_verified_at'] = null;
        }

        $updated = $this->users->updateWithProfile($user, $userData, $profileData);

        $governmentIdentityFiles = array_filter(Arr::wrap($request->file('government_identity')));
        $identityType = $validated['government_identity_type'] ?? $updated->profile->governmentIdentity?->identity_type;
        $this->storeGovernmentIdentity($governmentIdentityFiles, $identityType, $updated->profile);

        // Reload latest identity
        $updated->refresh()->load('profile.governmentIdentity');

        $identity = $updated->profile->governmentIdentity;

        if ($identity && $identity->storage_path) {
            $identity->storage_path = $this->storage->signedUrl($identity->storage_path);
        }

        Log::info('updated.user.information', ['info' => $updated]);

        return response()->json([
            'status' => 'success',
            'message' => 'User updated successfully.',
            'data' => $updated,
        ]);
    }

    public function destroy(int $id)
    {
        $user = $this->users->findById($id, ['profile']);

        if (!$user) {
            throw new ModelNotFoundException("User {$id} not found.");
        }

        $this->users->delete($user);

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully.',
        ]);
    }

    public function resolveSearch(Request $request)
    {
        $search = $request->input('search');

        if (is_null($search)) {
            return null;
        }

        return !empty($search) ? $search : null;
    }

    private function storeGovernmentIdentity($files, ?string $type, UserProfile $userProfile): void
    {
        $typePayload = [];

        if (!empty($type)) {
            $typePayload['identity_type'] = $type;
        }

        if (empty($files)) {
            if (!empty($typePayload)) {
                $userProfile->governmentIdentity()->update($typePayload);
            }
            return;
        }

        foreach ($files as $file) {
            if (!$file) {
                Log::warning('gov-id.update.null-file');
                continue;
            }

            $path = "government-ids/{$userProfile->id}";

            $storagePath = $this->storage->upload($file, $path);

            Log::info('gov-id.update.saved', ['path' => $storagePath]);

            $userProfile->governmentIdentity()->updateOrCreate(
                [],
                [
                    'storage_path' => $storagePath,
                    ...$typePayload,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]
            );
        }
        $userProfile->loadMissing('governmentIdentity');
    }

    private function appendGovernmentIdSignedUrl(mixed $user): void
    {
        $identity = $user?->profile?->governmentIdentity;

        if (!$identity || !$identity->storage_path || str_starts_with($identity->storage_path, 'http')) {
            return;
        }

        $identity->storage_path = $this->storage->signedUrl($identity->storage_path);
    }

    private function withGovernmentIdUrls(Collection|LengthAwarePaginator|mixed $users): Collection|LengthAwarePaginator|mixed
    {
        if ($users instanceof LengthAwarePaginator) {
            $users->getCollection()->each(function ($user) {
                $this->appendGovernmentIdSignedUrl($user);
            });
            return $users;
        }

        if ($users instanceof Collection) {
            $users->each(function ($user) {
                $this->appendGovernmentIdSignedUrl($user);
            });
            return $users;
        }

        $this->appendGovernmentIdSignedUrl($users);

        return $users;
    }
}
