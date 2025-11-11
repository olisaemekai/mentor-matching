<?php
// app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\MentorshipMatch;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    protected $matchingService;

    public function __construct(MatchingService $matchingService)
    {
        $this->matchingService = $matchingService;
        // $this->middleware('admin'); // We'll create this middleware
    }

    public function dashboard()
    {
        $metrics = [
            'totalUsers' => User::count(),
            'activeMentors' => User::mentors()->active()->count(),
            'activeMentees' => User::mentees()->active()->count(),
            'activeMatches' => MentorshipMatch::active()->count(),
            'pendingMatches' => MentorshipMatch::pending()->count(),
            'completedMatches' => MentorshipMatch::completed()->count(),
        ];

        $recentMatches = MentorshipMatch::with(['mentor', 'mentee'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => $metrics,
            'recentMatches' => $recentMatches,
        ]);
    }

    public function usersIndex(Request $request)
    {
        $filters = $request->only(['search', 'role', 'status']);

        $users = User::with(['skills', 'mentorCapacity'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%')
                        ->orWhere('industry', 'like', '%' . $search . '%');
                });
            })
            ->when($filters['role'] ?? null, function ($query, $role) {
                $query->where('role', $role);
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                if ($status === 'active') {
                    $query->where('is_active', true);
                } elseif ($status === 'inactive') {
                    $query->where('is_active', false);
                }
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'stats' => [
                'total' => User::count(),
                'mentors' => User::mentors()->count(),
                'mentees' => User::mentees()->count(),
                'active' => User::active()->count(),
                'inactive' => User::where('is_active', false)->count(),
            ]
        ]);
    }

    public function userDetail(User $user)
    {
        $user->load([
            'skills',
            'goals.skill',
            'mentorCapacity',
            'mentorMatches.mentee',
            'menteeMatches.mentor'
        ]);

        // Get all matches involving this user
        $allMatches = MentorshipMatch::where(function ($query) use ($user) {
            $query->where('mentor_id', $user->id)
                ->orWhere('mentee_id', $user->id);
        })
            ->with(['mentor', 'mentee'])
            ->latest()
            ->get();

        $matchStats = [
            'total' => $allMatches->count(),
            'active' => $allMatches->where('status', 'active')->count(),
            'pending' => $allMatches->where('status', 'pending')->count(),
            'completed' => $allMatches->where('status', 'completed')->count(),
        ];

        return Inertia::render('Admin/Users/Detail', [
            'user' => $user,
            'matches' => $allMatches,
            'matchStats' => $matchStats,
            'suggestedMatches' => $this->matchingService->getMatches($user),
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:mentor,mentee,both',
            'experience_level' => 'required|in:junior,mid,senior,executive',
            'industry' => 'nullable|string|max:100',
            'function' => 'nullable|string|max:100',
            'communication_style' => 'nullable|in:direct,supportive,structured,flexible,casual',
            'time_zone' => 'nullable|string|max:50',
            'bio' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function updateMentorCapacity(Request $request, User $user)
    {
        if (!$user->isMentor()) {
            return redirect()->back()->with('error', 'User is not a mentor.');
        }

        $validated = $request->validate([
            'max_mentees' => 'required|integer|min:1|max:10',
            'availability_status' => 'required|in:available,limited,full',
        ]);

        $user->mentorCapacity()->updateOrCreate(
            ['mentor_id' => $user->id],
            $validated
        );

        return redirect()->back()->with('success', 'Mentor capacity updated successfully.');
    }

    public function createMatch(Request $request)
    {
        $validated = $request->validate([
            'mentor_id' => 'required|exists:users,id',
            'mentee_id' => 'required|exists:users,id',
            'status' => 'required|in:pending,active',
        ]);

        // Check if match already exists
        $existingMatch = MentorshipMatch::where('mentor_id', $validated['mentor_id'])
            ->where('mentee_id', $validated['mentee_id'])
            ->first();

        if ($existingMatch) {
            return redirect()->back()->with('error', 'Match already exists between these users.');
        }

        // Calculate compatibility score
        $mentor = User::find($validated['mentor_id']);
        $mentee = User::find($validated['mentee_id']);
        $score = $this->matchingService->calculateCompatibility($mentor, $mentee);

        MentorshipMatch::create([
            'mentor_id' => $validated['mentor_id'],
            'mentee_id' => $validated['mentee_id'],
            'compatibility_score' => $score,
            'status' => $validated['status'],
            'matched_at' => $validated['status'] === 'active' ? now() : null,
        ]);

        return redirect()->back()->with('success', 'Match created successfully.');
    }

    public function updateMatchStatus(Request $request, MentorshipMatch $match)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,active,on_hold,completed,discontinued',
        ]);

        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'active' && !$match->matched_at) {
            $updateData['matched_at'] = now();
        }

        if ($validated['status'] === 'completed' && !$match->completed_at) {
            $updateData['completed_at'] = now();
        }

        $match->update($updateData);

        return redirect()->back()->with('success', 'Match status updated successfully.');
    }

    public function deleteMatch(MentorshipMatch $match)
    {
        $match->delete();

        return redirect()->back()->with('success', 'Match deleted successfully.');
    }


    public function updateAlgorithmWeights(Request $request)
    {
        $validated = $request->validate([
            'weights.skills' => 'required|numeric|between:0,1',
            'weights.experience' => 'required|numeric|between:0,1',
            'weights.industry' => 'required|numeric|between:0,1',
            'weights.communication' => 'required|numeric|between:0,1',
            'weights.timezone' => 'required|numeric|between:0,1',
            'weights.availability' => 'required|numeric|between:0,1',
        ]);

        // Ensure weights sum to 1
        $total = array_sum($validated['weights']);
        if (abs($total - 1.0) > 0.01) {
            return redirect()->back()->with('error', 'Weights must sum to 1.0');
        }

        // Update weights in config or database
        // For now, we'll update the service instance
        $this->matchingService->setWeights($validated['weights']);

        return redirect()->back()->with('success', 'Algorithm weights updated successfully.');
    }
}
