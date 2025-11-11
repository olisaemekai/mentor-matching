<?php
// app/Http/Controllers/MatchingController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\MentorshipMatch;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MatchingController extends Controller
{
    protected $matchingService;

    public function __construct(MatchingService $matchingService)
    {
        $this->matchingService = $matchingService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $matches = $this->matchingService->getMatches($user);

        return Inertia::render('Matches/Index', [
            'matches' => $matches,
        ]);
    }

    public function requestMatch(Request $request, User $user)
    {
        $currentUser = Auth::user();

        // Validate roles (mentee can only request mentors, mentor can only request mentees)
        if ($currentUser->isMentee() && !$user->isMentor()) {
            return redirect()->back()->with('error', 'You can only request mentors.');
        }

        if ($currentUser->isMentor() && !$user->isMentee()) {
            return redirect()->back()->with('error', 'You can only request mentees.');
        }

        // Check if already matched
        $existingMatch = MentorshipMatch::where(function ($query) use ($currentUser, $user) {
            $query->where('mentor_id', $currentUser->isMentor() ? $currentUser->id : $user->id)
                ->where('mentee_id', $currentUser->isMentee() ? $currentUser->id : $user->id);
        })->first();

        if ($existingMatch) {
            return redirect()->back()->with('error', 'Match request already exists.');
        }

        // Calculate compatibility score
        $score = $currentUser->isMentee()
            ? $this->matchingService->calculateCompatibility($user, $currentUser)
            : $this->matchingService->calculateCompatibility($currentUser, $user);

        // Create match request
        MentorshipMatch::create([
            'mentor_id' => $currentUser->isMentor() ? $currentUser->id : $user->id,
            'mentee_id' => $currentUser->isMentee() ? $currentUser->id : $user->id,
            'compatibility_score' => $score,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Match request sent successfully!');
    }

    public function acceptMatch(Request $request, MentorshipMatch $match)
    {
        $user = Auth::user();

        // Check if user is part of this match
        if ($match->mentor_id !== $user->id && $match->mentee_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        // Check if user is the mentor (only mentors can accept requests)
        if ($match->mentor_id !== $user->id) {
            return redirect()->back()->with('error', 'Only mentors can accept match requests.');
        }

        // Check mentor capacity
        $mentorCapacity = $user->mentorCapacity;
        if (!$mentorCapacity->hasCapacity()) {
            return redirect()->back()->with('error', 'You have reached your mentee limit.');
        }

        $match->activate();
        $mentorCapacity->incrementMenteeCount();

        return redirect()->back()->with('success', 'Match accepted! The mentorship has started.');
    }

    public function declineMatch(Request $request, MentorshipMatch $match)
    {
        $user = Auth::user();

        // Check if user is part of this match
        if ($match->mentor_id !== $user->id && $match->mentee_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $match->update(['status' => 'discontinued']);

        return redirect()->back()->with('success', 'Match request declined.');
    }

    public function completeMatch(Request $request, MentorshipMatch $match)
    {
        $user = Auth::user();

        // Check if user is part of this match
        if ($match->mentor_id !== $user->id && $match->mentee_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $match->complete();

        // Decrement mentor's current mentee count
        if ($match->mentor->mentorCapacity) {
            $match->mentor->mentorCapacity->decrementMenteeCount();
        }

        return redirect()->back()->with('success', 'Mentorship marked as completed.');
    }

    public function activities(MentorshipMatch $match)
    {
        $user = auth()->user();

        // Ensure the current user is part of the match
        if ($match->mentor_id !== $user->id && $match->mentee_id !== $user->id) {
            abort(403);
        }

        $match->load([
            'mentor',
            'mentee',
            'mentee.goals.skill'
        ]);

        return Inertia::render('Matches/Activities', [
            'match' => $match,
        ]);
    }
}
