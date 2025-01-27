<?php

namespace App\Models;

use App\Models\Customers\CustomerAddressModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'document_number',
        'document_type',
        'address_id',
        'status',
        'credit_limit',
        'notes',
        'category',
        'total_purchases'
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

    public function address()
    {
        return $this->belongsTo(CustomerAddressModel::class, 'address_id');
    }

    // public function category()
    // {
    //     return $this->belongsTo(CustomerCategory::class, 'customer_category_id');
    // }
}
