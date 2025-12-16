<?php

namespace App\Notifications;

use App\Models\Users\UserProfile;
use App\Notifications\Channels\SemaphoreChannel;
use App\Notifications\Contracts\SmsMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OtpCodeNotification extends Notification implements SmsMessage
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
        return [SemaphoreChannel::class];
    }

    /**
     * @param UserProfile $notifiable
     * @return array<string, string|null>
     */
    public function toSms($notifiable): array
    {
        return [
            'to' => $notifiable->routeNotificationForSemaphore(),
            'message' => sprintf('To ensure the security of your transactions, your BEIRS One-Time Password (OTP) is %s. Never disclose this code. It is valid for %d minutes.', $this->code, $this->ttlMinutes),
        ];
    }
}
