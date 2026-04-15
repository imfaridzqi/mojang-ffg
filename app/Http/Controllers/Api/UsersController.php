<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\Verify2FARequest;
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

    public function login(LoginUserRequest $request): JsonResponse
    {
        try {
            $result = $this->usersService->verifyCredentials($request->validated());

            return response()->json(['data' => $result], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    public function verifyTotp(Verify2FARequest $request): JsonResponse
    {
        try {
            $userToken = $this->usersService->verifyTotp($request->validated());

            return response()->json(['data' => ['token' => $userToken->token]], 200);
        } catch (Exception $e) {
            $status = $e->getCode() === 401 ? 401 : 422;

            return response()->json(['error' => $e->getMessage()], $status);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $token = substr($request->header('Authorization'), 7);
        $this->usersService->logoutUser($token);

        return response()->json(['data' => 'OK'], 200);
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
