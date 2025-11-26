<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Interfaces\UsersRepositoryInterface;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OtpController extends Controller
{
    public function __construct(
        private readonly UsersRepositoryInterface $users,
        private readonly OtpService $otpService,
    ) {
    }

    public function request(Request $request)
    {
        $credentials = $this->validateCredentials($request);

        $user = $this->users->findByEmail($credentials['email'], ['profile']);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect email address or password...'], 401);
        }

        if (!$this->otpService->isEnabled()) {
            return response()->json([
                'status' => 'disabled',
                'user_id' => $user->id,
                'message' => 'OTP is not enabled.',
            ], 400);
        }

        $otpResponse = $this->otpService->requestForUser($user);
        return response()->json(
            [
                'status' => $otpResponse['status'],
                'user_id' => $user->id,
                'message' => $otpResponse['message'],
                'show_otp' => $otpResponse['show_otp']
            ],
            $otpResponse['status_code'] ?? 200
        );
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'otp_code' => ['required', 'string'],
        ]);

        $user = $this->users->findById((int) $validated['user_id'], ['profile']);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $verification = $this->otpService->verify($user, $validated['otp_code']);

        if (!$verification['ok']) {
            return response()->json(
                [
                    'status' => $verification['status'],
                    'user_id' => $user->id,
                    'message' => $verification['message'],
                ],
                $verification['status_code'] ?? 400
            );
        }

        if ($user->profile && !$user->profile->mobile_verified_at) {
            $user->profile->update(['mobile_verified_at' => now()]);
        }

        $user->load('profile');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function requestForAuthenticated(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $otpResponse = $this->otpService->requestForUser($user);

        return response()->json([
            'status' => $otpResponse['status'],
            'message' => $otpResponse['message'],
            'show_otp' => $otpResponse['show_otp']
        ], $otpResponse['status_code'] ?? 200);
    }

    public function verifyForAuthenticated(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $validated = $request->validate([
            'otp_code' => ['required', 'string'],
        ]);

        $verification = $this->otpService->verify($user, $validated['otp_code']);

        if (!$verification['ok']) {
            return response()->json([
                'status' => $verification['status'],
                'message' => $verification['message'],
            ], $verification['status_code'] ?? 400);
        }

        if ($user->profile && !$user->profile->mobile_verified_at) {
            $user->profile->update(['mobile_verified_at' => now()]);
        }

        $user->load('profile');

        return response()->json([
            'status' => 'success',
            'message' => 'Mobile number verified successfully.',
            'user' => $user,
        ]);
    }

    /**
     * @return array{email: string, password: string}
     */
    private function validateCredentials(Request $request): array
    {
        return $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
    }
}
