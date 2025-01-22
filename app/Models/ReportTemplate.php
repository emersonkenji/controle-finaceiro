<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'config',
        'status'
    ];

    protected $casts = [
        'config' => 'array'
    ];

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
