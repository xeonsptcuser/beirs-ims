<?php

namespace App\Services;

use App\Exceptions\MessagingException;
use GuzzleHttp\Client;

class SemaphoreClient
{
    public function __construct(
        private readonly Client $http = new Client(['base_uri' => 'https://api.semaphore.co/api/v4/'])
    ) {
    }

    public function sendSms(string $to, string $message): void
    {
        $apiKey = config('services.semaphore.api_key');
        $senderName = config('services.semaphore.sender_name');

        if (!$apiKey) {
            throw MessagingException::failed(['message' => 'Semaphore credentials are missing.']);
        }

        $response = $this->http->post('messages', [
            'form_params' => array_filter([
                'apikey' => $apiKey,
                'number' => $to,
                'message' => $message,
                'sendername' => $senderName,
            ]),
            'timeout' => 15,
        ]);

        $status = $response->getStatusCode();
        if ($status < 200 || $status >= 300) {
            throw MessagingException::failed([
                'message' => "Semaphore SMS failed with status {$status}",
            ]);
        }
    }
}
