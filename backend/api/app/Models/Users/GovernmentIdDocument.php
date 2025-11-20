<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GovernmentIdDocument extends Model
{
    protected $fillable = [
        'user_profile_id',
        'storage_path',
        'original_name',
        'mime_type',
        'size',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class, 'user_profile_id');
    }
}
