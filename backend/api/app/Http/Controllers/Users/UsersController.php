<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Interfaces\UsersRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    public function __construct(private readonly UsersRepositoryInterface $users)
    {
    }

    // GET /api/auth/users
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page');
        $users = $this->users->all(['profile'], $perPage);

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    // GET /api/auth/users/{id}
    public function show(Request $request)
    {
        $id = $request->integer('user_id');
        $user = $this->users->findById($id, ['profile']);

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    // POST /api/auth/users/
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(['admin', 'staff', 'resident'])],
            'date_of_birth' => ['required', 'date'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'mobile_number' => ['nullable', 'string', 'max:20'],
        ]);

        $user = $this->users->createWithProfile(
            [
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role']
            ],
            [

                'name' => $validated['name'],
                'date_of_birth' => Carbon::parse($validated['date_of_birth']),
                'street_address' => $validated['street_address'],
                'mobile_number' => $validated['mobile_number'],

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
        $user = $this->users->findById($id, ['profile']);

        if (!$user) {
            throw new ModelNotFoundException("User {$id} not found");
        }

        $validated = $request->validate([
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['sometimes', Rule::in(['admin', 'staff', 'resident'])],
            'name' => ['sometimes', 'string', 'max:255'],
            'street_address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'mobile_number' => ['sometimes', 'nullable', 'string', 'max:20'],
            'date_of_birth' => ['sometimes', 'date'],
        ]);

        $userData = collect($validated)->only(['email', 'password', 'role'])->filter()->toArray();
        $profileData = collect($validated)->only(['name', 'street_address', 'mobile_number', 'date_of_birth'])->filter()->toArray();

        $updated = $this->users->updateWithProfile($user, $userData, $profileData);

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
}
