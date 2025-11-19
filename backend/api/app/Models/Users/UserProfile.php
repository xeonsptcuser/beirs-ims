<?php

namespace App\Models\Users;

use App\Models\BlotterReport\BlotterReport;
use App\Models\Certificates\CertificateRequest;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class UserProfile extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'street_address',
        'address_line',
        'mobile_number',
        'date_of_birth',
        'is_active'
    ];

    /**
     * The attributes enables hasOne relationship.
     *
     * @var list<string>
     */
    public function user()
    {
        return $this->hasOne(User::class, 'user_profile_id');
    }

    public function certificateRequests()
    {
        return $this->hasMany(CertificateRequest::class, 'user_profile_id');
    }
    public function blotterReport()
    {
        return $this->hasMany(BlotterReport::class, 'user_profile_id');
    }


    public function routeNotificationForItextmo(): ?string
    {
        if (!$this->mobile_number) {
            return null;
        }

        $digits = preg_replace('/[^0-9+]/', '', $this->mobile_number);
        return str_starts_with($digits, '+') ? $digits : '+63' . ltrim($digits, '0');
    }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean'
    ];
}
