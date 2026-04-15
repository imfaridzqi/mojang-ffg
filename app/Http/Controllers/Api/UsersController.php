<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Services\UsersService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function current(Request $request): JsonResponse
    {
        $user = $request->auth_user;

        return response()->json([
            'data' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'nik'        => $user->nik,
                'created_at' => $user->created_at,
            ],
        ], 200);
    }
}
