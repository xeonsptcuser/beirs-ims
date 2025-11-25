<?php

namespace App\Notifications\Contracts;

interface ITextMoMessage
{
    /**
     * Build the SMS payload for iTextMo.
     *
     * @param object $notifiable The notifiable entity (e.g., UserProfile)
     * @return array{to: string|null, message: string}
     */
    public function toItextMo(object $notifiable): array;
}
