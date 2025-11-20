<?php

namespace App\Notifications;

use App\Models\BlotterReport\BlotterReport;
use App\Models\Users\User;
use App\Notifications\Channels\ItextmoChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BlotterReportStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly BlotterReport $blotterReport,
        private readonly User $handler
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', ItextmoChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'certificate_id' => $this->blotterReport->id,
            'status' => $this->blotterReport->status,
            'handler' => [
                'id' => $this->handler->id,
                'name' => $this->handler->profile?->first_name . ' ' . $this->handler->profile?->middle_name . ' ' . $this->handler->profile?->last_name,
                'role' => $this->handler->role,
            ],
            'message' => sprintf(
                'Your incident report is now %s',
                strtoupper($this->blotterReport->status)
            ),
        ];
    }

    // Update the name
    public function toItextMo(object $notifiable): array
    {
        return [
            'to' => $notifiable->mobile_number,
            'message' => sprintf(
                'Hi %s, your %s request is now %s. %s',
                $this->blotterReport->profile?->first_name ?? 'Resident',
                $this->blotterReport->cert_request_type,
                strtoupper($this->blotterReport->status),
                $this->blotterReport->status === BlotterReport::STATUS_RELEASED
                ? 'Pick it up at the barangay hall.'
                : 'Check the app for details.'
            ),
        ];
    }

}
