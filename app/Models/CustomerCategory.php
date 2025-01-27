<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;
// use Illuminate\Database\Eloquent\Relations\HasMany;
// use Illuminate\Database\Eloquent\Relations\BelongsTo;

// class CustomerCategory extends Model
// {
//     use HasFactory, SoftDeletes;

//     protected $fillable = [
//         'name',
//         'description',
//         'parent_id',
//         'order',
//         'active'
//     ];

//     protected $casts = [
//         'active' => 'boolean',
//         'order' => 'integer'
//     ];

//     public function customers(): HasMany
//     {
//         return $this->hasMany(Customer::class);
//     }

//     public function parent(): BelongsTo
//     {
//         return $this->belongsTo(CustomerCategory::class, 'parent_id');
//     }

//     public function children(): HasMany
//     {
//         return $this->hasMany(CustomerCategory::class, 'parent_id');
//     }
// }
