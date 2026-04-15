<?php

use App\Http\Controllers\Api\UsersController;
use Illuminate\Support\Facades\Route;

Route::post('/users', [UsersController::class, 'store']);
Route::get('/users/current', [UsersController::class, 'current'])->middleware('auth.token');
