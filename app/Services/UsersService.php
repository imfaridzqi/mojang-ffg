<?php

namespace App\Services;

use App\Models\User;
use Exception;

class UsersService
{
    public function registerUser(array $data): User
    {
        if (User::where('nik', $data['nik'])->exists()) {
            throw new Exception('NIK sudah terdaftar');
        }

        return User::create($data);
    }
}
