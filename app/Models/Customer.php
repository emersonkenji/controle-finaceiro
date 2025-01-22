<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'cpf',
        'phone',
        'category',
        'status',
        'address',
        'score',
        'total_purchases',
        'last_purchase_at'
    ];

    protected $casts = [
        'address' => 'array',
        'last_purchase_at' => 'datetime',
        'total_purchases' => 'decimal:2'
    ];

    public function documents()
    {
        return $this->hasMany(CustomerDocument::class);
    }

    public function history()
    {
        return $this->hasMany(CustomerHistory::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
