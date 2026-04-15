<?php

use App\Http\Controllers\Api\UsersController;
use Illuminate\Support\Facades\Route;

Route::post('/users', [UsersController::class, 'store']);
Route::post('/users/login', [UsersController::class, 'login']);
