<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Services\UsersService;
use Exception;
use Illuminate\Http\JsonResponse;

class UsersController extends Controller
{
    public function __construct(private UsersService $usersService) {}

    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $this->usersService->registerUser($request->validated());

            return response()->json(['data' => 'OK'], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
