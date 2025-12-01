<?php

namespace App\Exceptions;

use RuntimeException;

class MessagingException extends RuntimeException
{
    public static function failed(array $context = []): self
    {
        $message = $context['message'] ?? 'SMS request failed.';
        return new self($message);
    }
}
