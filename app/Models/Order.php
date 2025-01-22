<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'user_id',
        'number',
        'status',
        'subtotal',
        'discount_type',
        'discount_value',
        'shipping_cost',
        'total',
        'payment_method',
        'payment_status',
        'notes',
        'delivery_address'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_value' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total' => 'decimal:2',
        'delivery_address' => 'array'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(OrderPayment::class);
    }

    public function history()
    {
        return $this->hasMany(OrderHistory::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            $order->number = static::generateOrderNumber();
        });
    }

    protected static function generateOrderNumber()
    {
        $lastOrder = static::withTrashed()->orderBy('id', 'desc')->first();
        $lastNumber = $lastOrder ? intval(substr($lastOrder->number, 3)) : 0;
        return 'PED' . str_pad($lastNumber + 1, 7, '0', STR_PAD_LEFT);
    }
}
