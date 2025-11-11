<?php
// app/Services/MatchingService.php

namespace App\Services;

use App\Models\User;
use App\Models\MentorshipMatch;
use App\Models\MentorCapacity;

class MatchingService
{
    protected $weights;

    public function __construct(?array $weights = null)
    {
        $this->weights = $weights ?? [
            'skills' => 0.40,
            'experience' => 0.20,
            'industry' => 0.15,
            'communication' => 0.10,
            'timezone' => 0.10,
            'availability' => 0.05
        ];
    }

    public function calculateCompatibility(User $mentor, User $mentee): float
    {
        $totalScore = 0;

        $totalScore += $this->calculateSkillMatch($mentor, $mentee) * $this->weights['skills'];
        $totalScore += $this->calculateExperienceMatch($mentor, $mentee) * $this->weights['experience'];
        $totalScore += $this->calculateIndustryMatch($mentor, $mentee) * $this->weights['industry'];
        $totalScore += $this->calculateCommunicationMatch($mentor, $mentee) * $this->weights['communication'];
        $totalScore += $this->calculateTimezoneMatch($mentor, $mentee) * $this->weights['timezone'];
        $totalScore += $this->calculateAvailabilityMatch($mentor) * $this->weights['availability'];

        return min(100, $totalScore * 100);
    }

    private function calculateSkillMatch(User $mentor, User $mentee): float
    {
        $score = 0;
        $exactMatches = 0;

        // Get mentee goals with priority
        $menteeGoals = $mentee->goals()->with('skill')->orderBy('priority')->take(3)->get();

        // Get mentor skills with pivot data
        $mentorSkills = $mentor->skills()->withPivot('proficiency', 'is_primary')->get();

        foreach ($menteeGoals as $goal) {
            $mentorSkill = $mentorSkills->first(function ($skill) use ($goal) {
                return $skill->id === $goal->skill_id;
            });

            if ($mentorSkill) {
                $exactMatches++;

                // Base score for exact match
                $skillScore = 15;

                // Bonus for high proficiency (up to +5 points)
                $skillScore += min(5, $mentorSkill->pivot->proficiency);

                // Bonus for primary skill
                if ($mentorSkill->pivot->is_primary) {
                    $skillScore += 5;
                }

                $score += $skillScore;
            } elseif ($this->hasRelatedSkill($goal->skill, $mentorSkills)) {
                $score += 8;
            }
        }

        // Cap exact matches at 30 points
        if ($exactMatches >= 2) {
            $score = min($score, 30);
        }

        // Primary goal alignment bonus
        $primaryGoal = $menteeGoals->first();
        if ($primaryGoal) {
            $primaryMentorSkill = $mentorSkills->first(function ($skill) use ($primaryGoal) {
                return $skill->id === $primaryGoal->skill_id;
            });

            if ($primaryMentorSkill) {
                $score += 10;
            }
        }

        return min($score, 40) / 40; // Normalize to 0-1
    }

    private function hasRelatedSkill($goalSkill, $mentorSkills): bool
    {
        $relatedCategories = [
            'Backend Development' => ['Backend Development', 'Full Stack Development'],
            'Frontend Development' => ['Frontend Development', 'Full Stack Development'],
            'Leadership' => ['Leadership', 'Team Management', 'Project Management'],
            // Add more category relationships as needed
        ];

        $goalCategory = $goalSkill->category;
        $relatedCats = $relatedCategories[$goalCategory] ?? [$goalCategory];

        return $mentorSkills->contains(function ($skill) use ($relatedCats) {
            return in_array($skill->category, $relatedCats);
        });
    }

    private function calculateExperienceMatch(User $mentor, User $mentee): float
    {
        $mentorLevel = $mentor->experience_level;
        $menteeLevel = $mentee->experience_level;

        $matrix = [
            'junior' => ['mid' => 20, 'senior' => 15, 'executive' => 10, 'junior' => 10],
            'mid' => ['senior' => 20, 'executive' => 15, 'junior' => 15, 'mid' => 10],
            'senior' => ['executive' => 20, 'mid' => 20, 'junior' => 15, 'senior' => 10],
            'executive' => ['senior' => 20, 'mid' => 15, 'junior' => 10, 'executive' => 10]
        ];

        return ($matrix[$menteeLevel][$mentorLevel] ?? 10) / 20;
    }

    private function calculateIndustryMatch(User $mentor, User $mentee): float
    {
        if ($mentor->industry === $mentee->industry && $mentor->function === $mentee->function) {
            return 15 / 15;
        } elseif ($mentor->industry === $mentee->industry) {
            return 10 / 15;
        } elseif ($mentor->function === $mentee->function) {
            return 8 / 15;
        }
        return 0;
    }

    private function calculateCommunicationMatch(User $mentor, User $mentee): float
    {
        if ($mentor->communication_style === $mentee->communication_style) {
            return 10 / 10;
        }

        $compatiblePairs = [
            ['direct', 'structured'],
            ['supportive', 'flexible'],
            ['structured', 'direct'],
        ];

        foreach ($compatiblePairs as $pair) {
            if (in_array($mentor->communication_style, $pair) && in_array($mentee->communication_style, $pair)) {
                return 7 / 10;
            }
        }

        return 2 / 10;
    }

    private function calculateTimezoneMatch(User $mentor, User $mentee): float
    {
        // Simplified timezone matching - in real implementation, you'd calculate actual hour difference
        if ($mentor->time_zone === $mentee->time_zone) {
            return 10 / 10;
        }
        return 5 / 10; // Assume some overlap for different timezones
    }

    private function calculateAvailabilityMatch(User $mentor): float
    {
        if (!$mentor->mentorCapacity) {
            return 0;
        }

        if ($mentor->mentorCapacity->availability_status === 'available') {
            return 5 / 5;
        } elseif ($mentor->mentorCapacity->availability_status === 'limited') {
            return 3 / 5;
        }

        return 0;
    }

    public function getMatches(User $user): array
    {
        if ($user->isMentee()) {
            return $this->getMentorMatchesForMentee($user);
        } elseif ($user->isMentor()) {
            return $this->getMenteeMatchesForMentor($user);
        }

        return [];
    }

    private function getMentorMatchesForMentee(User $mentee): array
    {
        $mentors = User::mentors()
            ->active()
            ->with(['skills', 'mentorCapacity'])
            ->get();

        $matches = [];
        foreach ($mentors as $mentor) {
            // Check if mentor has capacity
            if (!$mentor->mentorCapacity || !$mentor->mentorCapacity->hasCapacity()) {
                continue;
            }

            // Check if already matched
            if ($this->alreadyMatched($mentor, $mentee)) {
                continue;
            }

            $score = $this->calculateCompatibility($mentor, $mentee);

            if ($score >= 60) { // Only show matches with 60%+ compatibility
                $matches[] = [
                    'user' => $mentor,
                    'compatibility_score' => $score,
                    'match_reasons' => $this->getMatchReasons($mentor, $mentee)
                ];
            }
        }

        // Sort by compatibility score and return top 3
        usort($matches, fn($a, $b) => $b['compatibility_score'] <=> $a['compatibility_score']);
        return array_slice($matches, 0, 3);
    }

    private function getMenteeMatchesForMentor(User $mentor): array
    {
        // Check if mentor has capacity
        if (!$mentor->mentorCapacity || !$mentor->mentorCapacity->hasCapacity()) {
            return [];
        }

        $mentees = User::mentees()
            ->active()
            ->with(['goals.skill', 'skills'])
            ->get();

        $matches = [];
        foreach ($mentees as $mentee) {
            // Check if already matched
            if ($this->alreadyMatched($mentor, $mentee)) {
                continue;
            }

            $score = $this->calculateCompatibility($mentor, $mentee);

            if ($score >= 60) { // Only show matches with 60%+ compatibility
                $matches[] = [
                    'user' => $mentee,
                    'compatibility_score' => $score,
                    'match_reasons' => $this->getMatchReasons($mentor, $mentee)
                ];
            }
        }

        // Sort by compatibility score and return top 3
        usort($matches, fn($a, $b) => $b['compatibility_score'] <=> $a['compatibility_score']);
        return array_slice($matches, 0, 3);
    }

    private function alreadyMatched(User $mentor, User $mentee): bool
    {
        return MentorshipMatch::where('mentor_id', $mentor->id)
            ->where('mentee_id', $mentee->id)
            ->exists();
    }

    private function getMatchReasons(User $mentor, User $mentee): array
    {
        $reasons = [];

        // Add match reasons based on high-scoring components
        if ($this->calculateSkillMatch($mentor, $mentee) > 0.7) {
            $reasons[] = "Strong skill alignment";
        }

        if ($this->calculateExperienceMatch($mentor, $mentee) > 0.8) {
            $reasons[] = "Ideal experience level match";
        }

        if ($this->calculateIndustryMatch($mentor, $mentee) > 0.8) {
            $reasons[] = "Same industry/function";
        }

        if ($this->calculateCommunicationMatch($mentor, $mentee) > 0.8) {
            $reasons[] = "Compatible communication styles";
        }

        if ($this->calculateTimezoneMatch($mentor, $mentee) > 0.8) {
            $reasons[] = "Same or compatible time zones";
        }

        return $reasons;
    }

    public function setWeights(array $weights): void
    {
        // Validate weights sum to 1
        $total = array_sum($weights);
        if (abs($total - 1.0) > 0.01) {
            throw new \InvalidArgumentException('Weights must sum to 1.0');
        }

        $this->weights = $weights;
    }
}
