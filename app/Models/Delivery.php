<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Delivery extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_id',
        'carrier_id',
        'tracking_code',
        'status',
        'estimated_delivery',
        'delivered_at',
        'notes'
    ];

    protected $casts = [
        'estimated_delivery' => 'datetime',
        'delivered_at' => 'datetime'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function carrier()
    {
        return $this->belongsTo(Carrier::class);
    }
}
