<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Interfaces\UsersRepositoryInterface;
use App\Models\Users\UserProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function __construct(private readonly UsersRepositoryInterface $users)
    {
    }

    // POST /api/login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = $this->users->findByEmail($credentials['email'], $credentials['profile']);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect email address or password...'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // POST /api/register
    public function register(Request $request)
    {
        // Add necessary fields here
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'date_of_birth' => 'required|date',
            'role' => 'in:admin,staff,resident',
            'street_address' => 'nullable|string|max:255',
            'mobile_number' => 'nullable|string|max:20',
        ]);

        $this->users->createWithProfile(
            [
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role'] ?? 'resident',
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
            'message' => 'User registered successfully.'
        ], 201);
    }

    // POST api/auth/logout
    public function logout(Request $request)
    {
        $user = $request->user();
        // Safety check in case token is missing or invalid
        $token = $user?->currentAccessToken();

        if ($token) {
            $token->delete();
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No active session found or token already expired.',
            ], 400);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully.'
        ]);
    }
}
