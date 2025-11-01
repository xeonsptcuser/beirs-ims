<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use App\Models\Users\UserProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    // POST /api/login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::with('profile')->where('email', $credentials['email'])->first();

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
        ]);

        $profile = UserProfile::create([
            'name' => $validated['name'],
            'date_of_birth' => Carbon::parse($validated['date_of_birth']),
            'street_address' => $request->street_address,
            'mobile_number' => $request->mobile_number,
        ]);

        $profile->user()->create([
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'] ?? 'resident',
        ]);

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
