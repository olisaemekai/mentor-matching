<?php
// app/Http/Controllers/ProfileController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Requests\LoginRequest;

class ProfileController extends Controller
{
    // Register a new user
    public function storeUser(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:mentor,mentee',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);



        event(new Registered($user));
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('user-profile.edit', absolute: false))->with('success', 'Registration successful. Please complete your profile.');
    }

    // Login an existing user
    public function loginUser(Request $request): RedirectResponse
    {
        // Validate the incoming request

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Attempt to authenticate the user
        if (Auth::attempt($credentials)) {
            // Regenerate session to prevent fixation
            $request->session()->regenerate();

            // Redirect to intended page or dashboard
            return redirect()->intended('dashboard')->with('success', 'Login successful!');
        }

        // If authentication fails
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    // Logout the user
    public function logout(Request $request)
    {
        Auth::logout(); // Logs the user out

        // Invalidate and regenerate the session to prevent fixation
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect user after logout
        return redirect('/login')->with('success', 'You have been logged out successfully.');
    }

    public function edit()
    {
        $user = Auth::user();
        $skills = Skill::all();

        return Inertia::render('Profile/Edit', [
            'user' => $user->load(['skills', 'goals.skill']),
            'skills' => $skills,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'industry' => 'nullable|string|max:100',
            'function' => 'nullable|string|max:100',
            'experience_level' => 'required|in:junior,mid,senior,executive',
            'communication_style' => 'nullable|in:direct,supportive,structured,flexible,casual',
            'time_zone' => 'nullable|string|max:50',
            'skills' => 'array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.proficiency' => 'required|integer|between:1,5',
            'skills.*.is_primary' => 'boolean',
            'goals' => 'array',
            'goals.*.skill_id' => 'required|exists:skills,id',
            'goals.*.priority' => 'required|integer|between:1,3',
            'goals.*.description' => 'nullable|string',
        ]);

        // Update basic user info
        $user->update($request->only([
            'name',
            'bio',
            'industry',
            'function',
            'experience_level',
            'communication_style',
            'time_zone'
        ]));

        // Sync skills with pivot data
        if (isset($validated['skills'])) {
            $skillsData = [];
            foreach ($validated['skills'] as $skill) {
                $skillsData[$skill['id']] = [
                    'proficiency' => $skill['proficiency'],
                    'is_primary' => $skill['is_primary'] ?? false
                ];
            }
            $user->skills()->sync($skillsData);
        }

        // Sync goals (for mentees)
        if (isset($validated['goals']) && $user->isMentee()) {
            $user->goals()->delete(); // Remove existing goals
            foreach ($validated['goals'] as $goal) {
                $user->goals()->create($goal);
            }
        }

        return redirect()->route('profile.edit')
            ->with('success', 'Profile updated successfully.');
    }
}
