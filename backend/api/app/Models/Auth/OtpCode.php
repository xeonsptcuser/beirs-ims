<?php

namespace App\Models\Auth;

use App\Models\Users\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtpCode extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'code_hash',
        'expires_at',
        'consumed_at',
        'attempts',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'immutable_datetime',
        'consumed_at' => 'immutable_datetime',
        'attempts' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at instanceof CarbonImmutable
            ? $this->expires_at->isPast()
            : CarbonImmutable::parse($this->expires_at)->isPast();
    }

    public function isConsumed(): bool
    {
        return !is_null($this->consumed_at);
    }

    public function markConsumed(): void
    {
        $this->forceFill(['consumed_at' => CarbonImmutable::now()])->save();
    }

    public function incrementAttempts(): void
    {
        $this->forceFill(['attempts' => $this->attempts + 1])->save();
    }
}
