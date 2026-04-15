<?php

use App\Http\Controllers\Api\UsersController;
use Illuminate\Support\Facades\Route;

Route::post('/users', [UsersController::class, 'store']);
Route::post('/users/login', [UsersController::class, 'login']);
Route::post('/users/verify-2fa', [UsersController::class, 'verifyTotp']);
Route::get('/users/current', [UsersController::class, 'current'])->middleware('auth.token');
Route::post('/users/logout', [UsersController::class, 'logout'])->middleware('auth.token');
