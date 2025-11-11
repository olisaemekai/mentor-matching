<?php
// app/Models/MentorCapacity.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorCapacity extends Model
{
    use HasFactory;

    protected $table = 'mentor_capacity';

    protected $fillable = [
        'mentor_id',
        'max_mentees',
        'current_mentees',
        'availability_status',
    ];

    protected $casts = [
        'max_mentees' => 'integer',
        'current_mentees' => 'integer',
    ];

    protected $attributes = [
        'max_mentees' => 2,
        'current_mentees' => 0,
        'availability_status' => 'available'
    ];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }


    /**
     * Check if mentor has available capacity
     */
    public function hasCapacity(): bool
    {
        return $this->current_mentees < $this->max_mentees;
    }

    /**
     * Get available slots
     */
    public function getAvailableSlots(): int
    {
        return max(0, $this->max_mentees - $this->current_mentees);
    }

    /**
     * Increment current mentee count
     */
    public function incrementMenteeCount(): void
    {
        $this->increment('current_mentees');
        $this->refreshAvailabilityStatus();
    }

    /**
     * Decrement current mentee count
     */
    public function decrementMenteeCount(): void
    {
        $this->decrement('current_mentees');
        $this->refreshAvailabilityStatus();
    }

    /**
     * Update availability status based on current capacity
     */
    protected function refreshAvailabilityStatus(): void
    {
        if ($this->current_mentees >= $this->max_mentees) {
            $this->availability_status = 'full';
        } elseif ($this->current_mentees >= ($this->max_mentees * 0.75)) {
            $this->availability_status = 'limited';
        } else {
            $this->availability_status = 'available';
        }

        $this->save();
    }
}
