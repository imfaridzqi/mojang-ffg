<?php

namespace App\Http\Middleware;

use App\Models\UserToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $token = substr($header, 7);

        $userToken = UserToken::where('token', $token)->with('user')->first();

        if (!$userToken) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->merge(['auth_user' => $userToken->user]);

        return $next($request);
    }
}
