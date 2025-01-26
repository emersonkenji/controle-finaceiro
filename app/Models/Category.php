<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function isReceivable()
    {
        return $this->type === 'receivable';
    }

    public function isPayable()
    {
        return $this->type === 'payable';
    }
}
