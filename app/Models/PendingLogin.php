<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingLogin extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'token', 'totp_secret_temp', 'expires_at'];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
