<?php

namespace App\Notifications\Contracts;

interface SmsMessage
{
    /**
     * Build the SMS payload.
     *
     * @param object $notifiable The notifiable entity (e.g., UserProfile)
     * @return array{to: string|null, message: string}
     */
    public function toSms(object $notifiable): array;
}
