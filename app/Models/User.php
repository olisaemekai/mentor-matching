<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'email_verified_at',
        'time_zone',
        'industry',
        'function',
        'experience_level',
        'communication_style',
        'bio',
        'avatar_url',
        'location',
        'experience_years',
        'education',
        'languages',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'user_skills')
            ->withPivot('proficiency', 'is_primary')
            ->withTimestamps();
    }

    public function goals()
    {
        return $this->hasMany(MenteeGoal::class, 'mentee_id');
    }

    // public function menteeGoals()
    // {
    //     return $this->hasMany(MenteeGoal::class, 'mentee_id');
    // }

    public function mentorCapacity()
    {
        return $this->hasOne(MentorCapacity::class, 'mentor_id');
    }


    // As a mentor, I have mentorship matches where I am the mentor
    public function mentorMatches()
    {
        return $this->hasMany(MentorshipMatch::class, 'mentor_id');
    }

    // As a mentee, I have mentorship matches where I am the mentee
    public function menteeMatches()
    {
        return $this->hasMany(MentorshipMatch::class, 'mentee_id');
    }

    /**
     * Get all matches for a user (both as mentor and mentee)
     */
    public function allMatches()
    {
        return MentorshipMatch::where(function ($query) {
            $query->where('mentor_id', $this->id)
                ->orWhere('mentee_id', $this->id);
        });
    }

    /**
     * Get active matches
     */
    public function activeMatches()
    {
        return $this->allMatches()->active();
    }



    // Scopes
    public function scopeMentors($query)
    {
        return $query->whereIn('role', ['mentor', 'both']);
    }

    public function scopeMentees($query)
    {
        return $query->whereIn('role', ['mentee', 'both']);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Check if user is a mentor
     */
    public function isMentor(): bool
    {
        return in_array($this->role, ['mentor', 'both']);
    }

    /**
     * Check if user is a mentee
     */
    public function isMentee(): bool
    {
        return in_array($this->role, ['mentee', 'both']);
    }

    /**
     * Check if user is a mentor
     */
    public function getIsMentorAttribute(): bool
    {
        return in_array($this->role, ['mentor', 'both']);
    }

    /**
     * Check if user is a mentee
     */
    public function getIsMenteeAttribute(): bool
    {
        return in_array($this->role, ['mentee', 'both']);
    }

    /**
     * Get primary skills using pivot
     */
    public function primarySkills()
    {
        return $this->skills()->wherePivot('is_primary', true);
    }

    /**
     * Get skills with high proficiency
     */
    public function expertSkills()
    {
        return $this->skills()->wherePivot('proficiency', '>=', 4);
    }

    /**
     * Add a skill to user with proficiency and primary status
     */
    public function addSkill(Skill $skill, int $proficiency = 3, bool $isPrimary = false): void
    {
        $this->skills()->syncWithoutDetaching([
            $skill->id => [
                'proficiency' => $proficiency,
                'is_primary' => $isPrimary
            ]
        ]);
    }

    /**
     * Remove a skill from user
     */
    public function removeSkill(Skill $skill): void
    {
        $this->skills()->detach($skill->id);
    }

    /**
     * Initialize mentor capacity if doesn't exist
     */
    public function getMentorCapacityAttribute()
    {
        if ($this->isMentor() && !$this->relationLoaded('mentorCapacity')) {
            $capacity = $this->mentorCapacity()->first();
            if (!$capacity) {
                $capacity = $this->mentorCapacity()->create();
            }
            return $capacity;
        }

        return $this->getRelation('mentorCapacity');
    }
}
