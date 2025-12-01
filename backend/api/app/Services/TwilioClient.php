<?php

namespace App\Services;

use App\Exceptions\MessagingException;
use GuzzleHttp\Client;

class TwilioClient
{
    public function __construct(
        private readonly Client $http = new Client(['base_uri' => 'https://api.twilio.com/2010-04-01/'])
    ) {
    }

    public function sendSms(string $to, string $message): void
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from = config('services.twilio.from');

        if (!$sid || !$token || !$from) {
            throw MessagingException::failed(['message' => 'Twilio credentials are missing.']);
        }

        $response = $this->http->post("Accounts/{$sid}/Messages.json", [
            'auth' => [$sid, $token],
            'form_params' => [
                'To' => $to,
                'From' => $from,
                'Body' => $message,
            ],
            'timeout' => 15,
        ]);

        $status = $response->getStatusCode();
        if ($status < 200 || $status >= 300) {
            throw MessagingException::failed([
                'message' => "Twilio SMS failed with status {$status}",
            ]);
        }
    }
}
