<?php

namespace App\Notifications\Channels;

use App\Services\ItextmoClient;
use Illuminate\Notifications\Notification;

class ItextmoChannel
{
    public function __construct(private readonly ItextmoClient $client)
    {
    }

    /**
     * @param object $notifiable The notifiable entity (e.g., UserProfile)
     * @param Notification $notification Any notification that implements toItextMo($notifiable)
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (!method_exists($notification, 'toItextMo')) {
            return;
        }

        $data = $notification->toItextMo($notifiable);
        if (!empty($data['to']) && !empty($data['message'])) {
            $this->client->sendSms($data['to'], $data['message']);
        }
    }
}
