<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\MatchingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// User Registration Routes
Route::get('/registration', function () {
    return Inertia::render('Profile/Register');
})->name('user-profile.registration');
Route::get('/loginpage', function () {
    return Inertia::render('Profile/Login');
})->name('user-profile.login');
Route::post('/loginpage', [ProfileController::class, 'loginUser'])->name('user-profile.loginUser');
Route::post('/registration', [ProfileController::class, 'storeUser'])->name('user-profile.storeUser');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('main-dashboard', function () {
        return Inertia::render('dashboard');
    })->name('main-dashboard');

    Route::get('home-page', function () {
        return Inertia::render('home/home');
    })->name('home-page');


    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


    // Profile
    // Route::get('/profile-details', [ProfileController::class, 'show'])->name('user-profile.show');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('user-profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('user-profile.update');
    Route::post('/logout', [ProfileController::class, 'logout'])->name('user-profile.logout');

    // Matching
    Route::get('/matches', [MatchingController::class, 'index'])->name('matches.index');
    Route::post('/matches/{user}/request', [MatchingController::class, 'requestMatch'])->name('matches.request');
    Route::post('/matches/{match}/accept', [MatchingController::class, 'acceptMatch'])->name('matches.accept');
    Route::post('/matches/{match}/decline', [MatchingController::class, 'declineMatch'])->name('matches.decline');
    Route::post('/matches/{match}/complete', [MatchingController::class, 'completeMatch'])->name('matches.complete');

    // Mentorship Activities
    Route::get('/matches/{match}/activities', [MatchingController::class, 'activities'])->name('matches.activities');

    // Goal management
    Route::post('/goals/{goal}', [GoalController::class, 'update'])->name('goals.update');
});


// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // User Management
    Route::get('/users', [AdminController::class, 'usersIndex'])->name('admin.users.index');
    Route::get('/users/{user}', [AdminController::class, 'userDetail'])->name('admin.users.detail');
    Route::put('/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
    Route::post('/users/{user}/capacity', [AdminController::class, 'updateMentorCapacity'])->name('admin.users.capacity.update');

    // Match Management
    Route::post('/matches', [AdminController::class, 'createMatch'])->name('admin.matches.create');
    Route::post('/matches/{match}/status', [AdminController::class, 'updateMatchStatus'])->name('admin.matches.status.update');
    Route::delete('/matches/{match}', [AdminController::class, 'deleteMatch'])->name('admin.matches.delete');

    // Algorithm
    Route::post('/algorithm-weights', [AdminController::class, 'updateAlgorithmWeights'])->name('admin.algorithm-weights');
});

require __DIR__ . '/settings.php';
