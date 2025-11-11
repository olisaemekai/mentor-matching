<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Skill;
use App\Models\MenteeGoal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;

class UserSeeder extends Seeder
{
    public function run()
    {
        $skills = Skill::all();

        $industries = [
            'Technology',
            'Finance',
            'Healthcare',
            'Education',
            'Marketing',
            'Manufacturing',
            'Retail',
            'Telecommunications',
            'Consulting',
            'Government',
        ];

        $functions = [
            'Software Development',
            'Data Analysis',
            'Human Resources',
            'Project Management',
            'Sales & Marketing',
            'Customer Support',
            'Operations',
            'Finance',
            'Design',
            'Product Management',
        ];

        $timeZones = [
            'Africa/Lagos',
            'Europe/London',
            'America/New_York',
            'Asia/Dubai',
            'Asia/Singapore',
            'America/Los_Angeles',
            'Europe/Berlin',
            'Australia/Sydney',
        ];

        $communicationStyles = ['direct', 'supportive', 'structured', 'flexible', 'casual'];

        $educations = [
            'B.Sc. Computer Science',
            'B.A. Business Administration',
            'M.Sc. Data Science',
            'B.Eng. Electrical Engineering',
            'MBA',
            'B.Sc. Marketing',
            'M.A. Organizational Leadership',
            'B.Sc. Finance',
            'M.Sc. Software Engineering',
            'B.A. Psychology',
        ];

        // -------------------------
        // 1️⃣  Create Admins
        // -------------------------
        User::factory(4)->create([
            'role' => 'admin',
            'experience_level' => 'executive',
            'industry' => 'Technology',
            'function' => 'Administration',
            'time_zone' => 'Africa/Lagos',
            'communication_style' => 'structured',
            'education' => 'MBA',
            'bio' => 'Administrator overseeing the mentor-mentee platform operations and user management.',
        ]);

        // -------------------------
        // 2️⃣  Create Mentors (15–20)
        // -------------------------
        $mentors = User::factory(rand(15, 20))->create([
            'role' => 'mentor',
        ])->each(function ($mentor) use ($skills, $industries, $functions, $timeZones, $communicationStyles, $educations) {

            $mentor->update([
                'experience_level' => Arr::random(['mid', 'senior', 'executive']),
                'industry' => Arr::random($industries),
                'function' => Arr::random($functions),
                'time_zone' => Arr::random($timeZones),
                'communication_style' => Arr::random($communicationStyles),
                'education' => Arr::random($educations),
                'bio' => 'Experienced professional with a passion for mentoring and helping others grow in their careers.',
            ]);

            // Assign 3–6 skills to mentor
            $mentorSkills = $skills->random(rand(3, 6));
            foreach ($mentorSkills as $skill) {
                $mentor->skills()->attach($skill->id, [
                    'proficiency' => rand(3, 5),
                    'is_primary' => rand(0, 1) === 1,
                ]);
            }

            // Create mentor capacity record
            $mentor->mentorCapacity()->create([
                'max_mentees' => rand(2, 5),
                'current_mentees' => 0,
            ]);
        });

        // -------------------------
        // 3️⃣  Create Mentees (25–30)
        // -------------------------
        $mentees = User::factory(rand(25, 30))->create([
            'role' => 'mentee',
        ])->each(function ($mentee) use ($skills, $industries, $functions, $timeZones, $communicationStyles, $educations) {

            $mentee->update([
                'experience_level' => Arr::random(['junior', 'mid']),
                'industry' => Arr::random($industries),
                'function' => Arr::random($functions),
                'time_zone' => Arr::random($timeZones),
                'communication_style' => Arr::random($communicationStyles),
                'education' => Arr::random($educations),
                'bio' => 'Aspiring professional eager to gain new skills and grow with guidance from experienced mentors.',
            ]);

            // Assign 1–3 mentee goals (skills they want to learn)
            $menteeGoals = $skills->random(rand(1, 3));
            $priority = 1;
            foreach ($menteeGoals as $skill) {
                MenteeGoal::create([
                    'mentee_id' => $mentee->id,
                    'skill_id' => $skill->id,
                    'priority' => $priority++,
                    'description' => "I want to learn {$skill->name} to enhance my performance in {$mentee->function}.",
                ]);
            }
        });

        // -------------------------
        // 4️⃣  Output summary to console
        // -------------------------
        $this->command->info('✅ Seeded: 4 admins, ' . $mentors->count() . ' mentors, and ' . $mentees->count() . ' mentees.');
    }
}
