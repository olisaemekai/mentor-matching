<?php
// app/Models/Skill.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_skills')
            ->withPivot('proficiency', 'is_primary')
            ->withTimestamps();
    }

    public function menteeGoals()
    {
        return $this->hasMany(MenteeGoal::class);
    }


    /**
     * Get users with this skill as primary
     */
    public function primaryUsers()
    {
        return $this->users()->wherePivot('is_primary', true);
    }

    /**
     * Get expert users (proficiency >= 4)
     */
    public function expertUsers()
    {
        return $this->users()->wherePivot('proficiency', '>=', 4);
    }
}
