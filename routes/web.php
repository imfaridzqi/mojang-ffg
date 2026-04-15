<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function () {
    return Inertia::render('Login');
});

Route::get('/register', function () {
    return Inertia::render('Register');
});

Route::get('/verify-2fa', function () {
    return Inertia::render('VerifyTwoFA');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});
