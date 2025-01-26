<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'order_id',
        'amount',
        'rate',
        'date',
        'status',
        'notes'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'rate' => 'decimal:2',
        'date' => 'date',
        'status' => 'boolean'
    ];

    // Relacionamento com o funcionário
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    // Relacionamento com a venda
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Escopo para comissões pagas
    public function scopePaid($query)
    {
        return $query->where('status', true);
    }

    // Escopo para comissões pendentes
    public function scopePending($query)
    {
        return $query->where('status', false);
    }

    public function getFormattedAmountAttribute()
    {
        return number_format($this->amount, 2, ',', '.');
    }

    public function getFormattedRateAttribute()
    {
        return number_format($this->rate, 2, ',', '.');
    }

    public function getFormattedDateAttribute()
    {
        return $this->date ? $this->date->format('d/m/Y') : null;
    }
}
