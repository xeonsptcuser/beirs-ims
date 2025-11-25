<?php

namespace App\Notifications\Traits;

trait FormatITextMoMessage
{
    public function buildItextMoMessage(object $model, object $notifiable, string $releasedStatus): array
    {
        // Prefer the notifiable's route helper so numbers are normalized (+63, etc.)
        $mobile = method_exists($notifiable, 'routeNotificationForItextmo')
            ? $notifiable->routeNotificationForItextmo()
            : ($notifiable->mobile_number ?? null);

        if (!$mobile) {
            return [];
        }

        $firstName = $model->profile?->first_name
            ?? $model->user?->profile?->first_name
            ?? $notifiable->first_name
            ?? 'Resident';

        $subject = $model->cert_request_type
            ?? $model->incident_title
            ?? $model->incident_type
            ?? 'request';

        $status = strtoupper($model->status ?? '');
        $cta = ($model->status ?? null) === $releasedStatus
            ? 'Pick it up at the barangay hall.'
            : 'Check the app for details.';

        return [
            'to' => $mobile,
            'message' => sprintf(
                'Hi %s, your %s is now %s. %s',
                $firstName,
                $subject,
                $status,
                $cta
            ),
        ];
    }
}
