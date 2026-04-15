<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserToken;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class UsersService
{
    public function registerUser(array $data): User
    {
        if (User::where('nik', $data['nik'])->exists()) {
            throw new Exception('NIK sudah terdaftar');
        }

        return User::create($data);
    }

    public function loginUser(array $data): UserToken
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw new Exception('Email atau password salah', 401);
        }

        if (!$user->totp_secret) {
            throw new Exception('Google Authenticator belum dikonfigurasi', 403);
        }

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($user->totp_secret, $data['totp_code']);

        if (!$valid) {
            throw new Exception('Kode Google Authenticator tidak valid', 401);
        }

        return UserToken::create([
            'token'   => Str::uuid()->toString(),
            'user_id' => $user->id,
        ]);
    }
}
