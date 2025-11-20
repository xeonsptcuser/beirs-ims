<?php

namespace App\Models\BlotterReport;

use App\Models\Users\UserProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evidence extends Model
{
    protected $fillable = [
        'blotter_report_id',
        'storage_path',
        'original_name',
        'mime_type',
        'size',
    ];

    protected $casts = [
        'person_involved' => 'array',
        'witnesses' => 'array'
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class, 'user_profile_id');
    }

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(BlotterReport::class, 'blotter_report_id');
    }
}
