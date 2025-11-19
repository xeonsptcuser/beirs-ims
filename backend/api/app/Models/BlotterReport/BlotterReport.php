<?php

namespace App\Models\BlotterReport;

use App\Models\Users\UserProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlotterReport extends Model
{
    protected $fillable = [
        'user_profile_id',
        'handler_id',
        'incident_type',
        'incident_title',
        'datetime_of_incident',
        'location',
        'landmark',
        'person_involved',
        'witnesses',
        'description',
        'remarks',
    ];

    protected $casts = [
        'person_involved' => 'array',
        'witnesses' => 'array'
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class, 'user_profile_id');
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(Evidence::class, 'blotter_report_id');
    }
}
