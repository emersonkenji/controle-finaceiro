<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankStatement extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'description',
        'amount',
        'type',
        'bank',
        'account',
        'document',
        'reconciled',
        'transaction_id'
    ];

    protected $casts = [
        'date' => 'datetime',
        'amount' => 'decimal:2',
        'reconciled' => 'boolean'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
