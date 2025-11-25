<?php

namespace App\Notifications;

use App\Models\Users\UserProfile;
use App\Notifications\Channels\ITextMoChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OtpCodeNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $code, private readonly int $ttlMinutes)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [ITextMoChannel::class];
    }

    /**
     * @param UserProfile $notifiable
     * @return array<string, string|null>
     */
    public function toItextMo($notifiable): array
    {
        return [
            'to' => $notifiable->routeNotificationForItextmo(),
            'message' => sprintf('Your OTP code is %s. It expires in %d minutes.', $this->code, $this->ttlMinutes),
        ];
    }
}
