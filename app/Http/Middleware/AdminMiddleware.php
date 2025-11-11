<?php
// app/Http/Middleware/AdminMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // For now, we'll check if user email contains 'admin'
        // In production, you'd have a proper role system
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized access.');
        }
        // if (!Auth::check() || !str_contains(Auth::user()->email, 'admin')) {
        //     abort(403, 'Unauthorized access.');
        // }

        return $next($request);
    }
}
