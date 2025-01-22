<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'parent_id',
        'order',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
        'order' => 'integer'
    ];

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function parent()
    {
        return $this->belongsTo(CustomerCategory::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(CustomerCategory::class, 'parent_id');
    }
}
