<?php

namespace App\Notifications\Channels;

use App\Notifications\Contracts\ITextMoMessage;
use App\Services\ITextMoClient;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Throwable;

class ITextMoChannel
{
    public function __construct(private readonly ITextMoClient $client)
    {
    }

    /**
     * @param object $notifiable The notifiable entity (e.g., UserProfile)
     * @param Notification&ITextMoMessage $notification Notification that can format an iTextMo payload
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (!$notification instanceof ITextMoMessage) {
            return;
        }

        $data = $notification->toItextMo($notifiable);
        if (!empty($data['to']) && !empty($data['message'])) {
            try {
                $this->client->sendSms($data['to'], $data['message']);
            } catch (Throwable $e) {
                Log::warning('iTextMo SMS skipped; continuing without SMS delivery.', [
                    'notifiable' => get_class($notifiable),
                    'to' => $data['to'],
                    'message' => $data['message'],
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
