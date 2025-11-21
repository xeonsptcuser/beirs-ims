<?php

namespace App\Http\Controllers\Notifications;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function index(Request $request)
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            abort(404, 'Profile not found');
        }
        return response()->json([
            'status' => 'success',
            'data' => $profile
                ? $profile->notifications()->latest()->limit(20)->get()
                : [],
        ]);
    }

    public function markAsRead(Request $request, string $notificationId)
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            abort(404);
        }

        $notification = $profile->notifications()->whereKey($notificationId)->firstOrFail();
        $notification->markAsRead();

        return response()->json(['status' => 'success']);
    }
}
