<?php

namespace App\Notifications\Channels;

use App\Notifications\CertificateRequestStatusUpdated;
use App\Services\ItextmoClient;

class ItextmoChannel
{
    public function __construct(private readonly ItextmoClient $client)
    {
    }

    public function send(object $notifiable, CertificateRequestStatusUpdated $notification): void
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

