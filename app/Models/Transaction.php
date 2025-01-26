<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type',
        'description',
        'amount',
        'due_date',
        'paid_date',
        'status',
        'payment_method',
        'category_id',
        'cost_center_id',
        'reference_type',
        'reference_id',
        'user_id',
        'notes',
        'document_number',
        'installment_number',
        'total_installments',
        'bank_reconciliation_id',
        'reconciled_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'datetime',
        'paid_date' => 'datetime',
        'installment_number' => 'integer',
        'total_installments' => 'integer',
        'reconciled_at' => 'datetime'
    ];

    // Relacionamentos
    public function category()
    {
        return $this->belongsTo(TransactionCategory::class);
    }

    public function costCenter()
    {
        return $this->belongsTo(CostCenter::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reference()
    {
        return $this->morphTo();
    }

    public function bankStatement()
    {
        return $this->hasOne(BankStatement::class);
    }

    // Escopos
    public function scopeReceivables($query)
    {
        return $query->where('type', 'receivable');
    }

    public function scopePayables($query)
    {
        return $query->where('type', 'payable');
    }

    public function scopePending($query)
    {
        return $query->whereNull('paid_date');
    }

    public function scopePaid($query)
    {
        return $query->whereNotNull('paid_date');
    }

    public function scopeOverdue($query)
    {
        return $query->whereNull('paid_date')
            ->where('due_date', '<', now());
    }

    public function getFormattedAmountAttribute()
    {
        return number_format($this->amount, 2, ',', '.');
    }

    public function getFormattedDueDateAttribute()
    {
        return $this->due_date ? $this->due_date->format('d/m/Y') : null;
    }

    public function getFormattedPaidDateAttribute()
    {
        return $this->paid_date ? $this->paid_date->format('d/m/Y') : null;
    }
}
