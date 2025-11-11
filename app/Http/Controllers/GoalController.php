<?php
// app/Http/Controllers/GoalController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MenteeGoal;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function update(Request $request, MenteeGoal $goal)
    {
        // Verify the user owns this goal or is the mentor in the match
        $user = $request->user();

        if ($goal->mentee_id !== $user->id && !$this->isMentorForGoal($user, $goal)) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:active,completed,abandoned',
            'progress_notes' => 'sometimes|string|max:1000',
            'target_date' => 'sometimes|date|after:today',
        ]);

        $goal->update($validated);

        return redirect()->back()->with('success', 'Goal updated successfully.');
    }

    private function isMentorForGoal($user, MenteeGoal $goal): bool
    {
        // Check if user is mentor in an active match with the goal's mentee
        return $user->mentorMatches()
            ->where('mentee_id', $goal->mentee_id)
            ->where('status', 'active')
            ->exists();
    }
}
