<?php

namespace App\Models\Certificates;

use App\Models\Users\UserProfile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class CertificateRequest extends Model
{
    use HasFactory, Notifiable;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_RELEASED = 'released';
    public const STATUS_DONE = 'done';
    protected $fillable = [
        'user_profile_id',
        'cert_request_type',
        'start_residency_date',
        'end_residency_date',
        'cert_request_reason',
        'status'
    ];

    protected $casts = [
        'start_residency_date' => 'date',
        'end_residency_date' => 'date',
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING,
    ];

    public function profile()
    {
        return $this->belongsTo(UserProfile::class, 'user_profile_id');
    }

}
