<?php

namespace App\Notifications\Channels;

use App\Notifications\Contracts\ItextmoMessage;
use App\Services\ItextmoClient;
use Illuminate\Notifications\Notification;

class ItextmoChannel
{
    public function __construct(private readonly ItextmoClient $client)
    {
    }

    /**
     * @param object $notifiable The notifiable entity (e.g., UserProfile)
     * @param Notification&ItextmoMessage $notification Notification that can format an iTextMo payload
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (!$notification instanceof ItextmoMessage) {
            return;
        }

        $data = $notification->toItextMo($notifiable);
        if (!empty($data['to']) && !empty($data['message'])) {
            $this->client->sendSms($data['to'], $data['message']);
        }
    }
}
