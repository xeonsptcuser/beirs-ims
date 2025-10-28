<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login()
    {
        return response()->json(['status' => 'success', 'login attempt..']);
    }

    public function register()
    {
        return response()->json(['status' => 'success', 'register attempt..']);
    }

    public function logout()
    {
        return response()->json(['status' => 'success', 'logout attempt..']);
    }
}
