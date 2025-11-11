<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MentorshipMatch;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $matchingService;

    public function __construct(MatchingService $matchingService)
    {
        $this->matchingService = $matchingService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $data = [];

        if ($user->isMentee()) {
            $data['suggestedMentors'] = $this->matchingService->getMatches($user);
            $data['activeMatches'] = $user->menteeMatches()
                ->with('mentor')
                ->active()
                ->get();
        } elseif ($user->isMentor()) {
            $data['suggestedMentees'] = $this->matchingService->getMatches($user);
            $data['activeMatches'] = $user->mentorMatches()
                ->with('mentee')
                ->active()
                ->get();
            $data['pendingRequests'] = $user->mentorMatches()
                ->with('mentee')
                ->pending()
                ->get();
        }

        $data['user'] = $user->load(['skills', 'goals.skill']);
        // $data['isMentee'] = $user->isMentee();

        return Inertia::render('Dashboard/Index', $data);
    }
}
