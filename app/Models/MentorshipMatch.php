<?php
// app/Models/MentorshipMatch.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipMatch extends Model
{
    use HasFactory;

    protected $table = 'mentorship_matches';

    protected $fillable = [
        'mentor_id',
        'mentee_id',
        'compatibility_score',
        'status',
        'matched_at',
        'completed_at',
    ];

    protected $casts = [
        'matched_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'pending'
    ];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }


    /**
     * Scope for active matches
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for pending matches
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for completed matches
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Activate the match
     */
    public function activate(): void
    {
        $this->update([
            'status' => 'active',
            'matched_at' => $this->matched_at ?? now()
        ]);
    }

    /**
     * Complete the match
     */
    public function complete(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now()
        ]);
    }

    /**
     * Check if match is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if match is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
