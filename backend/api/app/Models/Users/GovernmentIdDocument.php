<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GovernmentIdDocument extends Model
{
    // Explicit table name to match migration
    protected $table = 'government_id_document';

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
