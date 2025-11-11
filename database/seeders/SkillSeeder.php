<?php
// database/seeders/SkillSeeder.php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run()
    {
        $skills = [
            // --- Tech / Software Development ---
            ['name' => 'PHP', 'category' => 'Backend Development'],
            ['name' => 'Laravel', 'category' => 'Backend Development'],
            ['name' => 'Python', 'category' => 'Backend Development'],
            ['name' => 'Node.js', 'category' => 'Backend Development'],
            ['name' => 'JavaScript', 'category' => 'Full Stack Development'],
            ['name' => 'React', 'category' => 'Frontend Development'],
            ['name' => 'Vue.js', 'category' => 'Frontend Development'],
            ['name' => 'Next.js', 'category' => 'Frontend Development'],
            ['name' => 'REST API Design', 'category' => 'Software Engineering'],
            ['name' => 'DevOps', 'category' => 'Cloud & Infrastructure'],
            ['name' => 'Docker', 'category' => 'Cloud & Infrastructure'],
            ['name' => 'AWS', 'category' => 'Cloud & Infrastructure'],
            ['name' => 'Database Design', 'category' => 'Data Management'],

            // --- Data & AI ---
            ['name' => 'Data Analysis', 'category' => 'Data Science'],
            ['name' => 'Machine Learning', 'category' => 'Data Science'],
            ['name' => 'SQL', 'category' => 'Data Management'],
            ['name' => 'Power BI', 'category' => 'Data Visualization'],
            ['name' => 'Excel Analytics', 'category' => 'Data Analysis'],

            // --- Business & Management ---
            ['name' => 'Project Management', 'category' => 'Business Management'],
            ['name' => 'Agile Methodologies', 'category' => 'Business Management'],
            ['name' => 'Entrepreneurship', 'category' => 'Business & Startups'],
            ['name' => 'Business Strategy', 'category' => 'Business Management'],
            ['name' => 'Digital Marketing', 'category' => 'Marketing'],
            ['name' => 'SEO', 'category' => 'Marketing'],
            ['name' => 'Content Marketing', 'category' => 'Marketing'],
            ['name' => 'Sales & Negotiation', 'category' => 'Sales'],

            // --- Design & Creative ---
            ['name' => 'Graphic Design', 'category' => 'Creative Design'],
            ['name' => 'UI/UX Design', 'category' => 'Creative Design'],
            ['name' => 'Adobe Photoshop', 'category' => 'Creative Tools'],
            ['name' => 'Video Editing', 'category' => 'Creative Media'],

            // --- Communication & Leadership ---
            ['name' => 'Leadership', 'category' => 'Soft Skills'],
            ['name' => 'Public Speaking', 'category' => 'Soft Skills'],
            ['name' => 'Emotional Intelligence', 'category' => 'Soft Skills'],
            ['name' => 'Time Management', 'category' => 'Soft Skills'],
            ['name' => 'Team Management', 'category' => 'Soft Skills'],
            ['name' => 'Critical Thinking', 'category' => 'Soft Skills'],

            // --- Education & Mentoring ---
            ['name' => 'Coaching & Mentorship', 'category' => 'Education'],
            ['name' => 'Curriculum Design', 'category' => 'Education'],
            ['name' => 'Training Facilitation', 'category' => 'Education'],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
