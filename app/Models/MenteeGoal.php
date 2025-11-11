<?php
// app/Models/MenteeGoal.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenteeGoal extends Model
{
    use HasFactory;

    protected $table = 'mentee_goals';

    protected $fillable = [
        'mentee_id',
        'skill_id',
        'priority',
        'description',
        'target_date',
        'status',
        'progress_notes'
    ];

    protected $casts = [
        'priority' => 'integer',
        'target_date' => 'date'

    ];

    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    /**
     * Scope for primary goals (priority 1)
     */
    public function scopePrimary($query)
    {
        return $query->where('priority', 1);
    }

    /**
     * Scope for ordered by priority
     */
    public function scopeByPriority($query)
    {
        return $query->orderBy('priority');
    }

    /**
     * Scope for active goals
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for completed goals
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Check if goal is overdue
     */
    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'active' &&
            $this->target_date &&
            $this->target_date->isPast();
    }

    /**
     * Get status color for UI
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'completed' => 'green',
            'abandoned' => 'red',
            'active' => $this->is_overdue ? 'orange' : 'blue',
            default => 'gray'
        };
    }
}
