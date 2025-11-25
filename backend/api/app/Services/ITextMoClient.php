<?php

namespace App\Services;

use App\Exceptions\MessagingException;
use GuzzleHttp\Client;

class ITextMoClient
{
    public function __construct(
        private readonly Client $http = new Client(['base_uri' => 'https://www.itexmo.com/php_api/'])
    ) {
    }

    public function sendSms(string $to, string $message): void
    {
        $response = $this->http->post('api.php', [
            'form_params' => [
                '1' => $to,
                '2' => $message,
                '3' => config('services.itextmo.code'),
                'passwd' => config('services.itextmo.password'),
                'senderid' => config('services.itextmo.sender'),
            ],
            'timeout' => 15,
        ]);

        $result = trim((string) $response->getBody());
        if ($result !== '0') { // iTextMo returns 0 on success
            throw new MessagingException("iTextMo SMS failed with code {$result}");
        }
    }
}
