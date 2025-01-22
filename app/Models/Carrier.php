<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Carrier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'document',
        'contact_name',
        'contact_phone',
        'contact_email',
        'address',
        'city',
        'state',
        'zip_code',
        'status',
        'notes'
    ];

    public function deliveries()
    {
        return $this->hasMany(Delivery::class);
    }
}
