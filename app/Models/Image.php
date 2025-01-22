<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Image extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'path',
        'alt',
        'order',
        'is_main',
        'imageable_id',
        'imageable_type'
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'order' => 'integer'
    ];

    public function imageable()
    {
        return $this->morphTo();
    }
}
