<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'email', 'password', 'nik', 'totp_secret'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function tokens()
    {
        return $this->hasMany(UserToken::class);
    }
}
