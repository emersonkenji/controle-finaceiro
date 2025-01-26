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
        'document',
        'phone',
        'customer_category_id',
        'address',
        'notes',
        'birth_date',
        'type'
    ];

    protected $casts = [
        'address' => 'array',
        'birth_date' => 'date',
    ];

    public function history()
    {
        return $this->hasMany(CustomerHistory::class);
    }

    public function documents()
    {
        return $this->hasMany(CustomerDocument::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function category()
    {
        return $this->belongsTo(CustomerCategory::class, 'customer_category_id');
    }
}
