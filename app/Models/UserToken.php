<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{
    public $timestamps = false;

    protected $fillable = ['token', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
