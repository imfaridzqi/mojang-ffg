<?php

namespace App\Services;

use App\Models\PendingLogin;
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
        if (User::where('email', $data['email'])->exists()) {
            throw new Exception('Email sudah terdaftar');
        }

        if (User::where('nik', $data['nik'])->exists()) {
            throw new Exception('NIK sudah terdaftar');
        }

        return User::create($data);
    }

    /**
     * Step 1: Validate email/NIK + password.
     * Returns a short-lived pending token and 2FA status.
     * If user has no TOTP yet, also generates a temp secret + QR URI.
     */
    public function verifyCredentials(array $data): array
    {
        $user = User::where('email', $data['login'])
            ->orWhere('nik', $data['login'])
            ->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw new Exception('Email/NIK atau password salah', 401);
        }

        $hasTotp        = (bool) $user->totp_secret;
        $totpSecretTemp = null;
        $totpUri        = null;

        if (!$hasTotp) {
            $google2fa      = new Google2FA();
            $totpSecretTemp = $google2fa->generateSecretKey();
            $totpUri        = $google2fa->getQRCodeUrl(
                'Mojang FFG',
                (string) $user->nik,
                $totpSecretTemp,
            );
        }

        // Clean up old pending logins for this user
        PendingLogin::where('user_id', $user->id)->delete();

        $pending = PendingLogin::create([
            'user_id'         => $user->id,
            'token'           => Str::uuid()->toString(),
            'totp_secret_temp' => $totpSecretTemp,
            'expires_at'      => now()->addMinutes(15),
        ]);

        return [
            'pending_token' => $pending->token,
            'has_totp'      => $hasTotp,
            'totp_uri'      => $totpUri,
        ];
    }

    /**
     * Step 2: Verify TOTP code using pending token.
     * If it's first-time setup, saves the totp_secret to the user.
     * Returns a full auth token on success.
     */
    public function verifyTotp(array $data): UserToken
    {
        $pending = PendingLogin::where('token', $data['pending_token'])
            ->where('expires_at', '>', now())
            ->with('user')
            ->first();

        if (!$pending) {
            throw new Exception('Sesi login tidak valid atau sudah kadaluarsa. Silakan login ulang.', 401);
        }

        $user      = $pending->user;
        $google2fa = new Google2FA();

        if ($pending->totp_secret_temp) {
            // First-time 2FA setup — verify against the temp secret
            if (!$google2fa->verifyKey($pending->totp_secret_temp, $data['totp_code'])) {
                throw new Exception('Kode Google Authenticator tidak valid', 401);
            }
            $user->totp_secret = $pending->totp_secret_temp;
            $user->save();
        } else {
            // Already enrolled — verify against stored secret
            if (!$google2fa->verifyKey($user->totp_secret, $data['totp_code'])) {
                throw new Exception('Kode Google Authenticator tidak valid', 401);
            }
        }

        $pending->delete();

        return UserToken::create([
            'token'   => Str::uuid()->toString(),
            'user_id' => $user->id,
        ]);
    }

    public function logoutUser(string $token): void
    {
        UserToken::where('token', $token)->delete();
    }
}
