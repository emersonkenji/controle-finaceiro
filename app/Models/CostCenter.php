<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CostCenter extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'parent_id',
        'budget',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
        'budget' => 'decimal:2'
    ];

    // Relacionamentos
    public function parent()
    {
        return $this->belongsTo(CostCenter::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(CostCenter::class, 'parent_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Escopos
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeParents($query)
    {
        return $query->whereNull('parent_id');
    }

    // Métodos
    public function getTotalSpentAttribute()
    {
        return $this->transactions()
            ->whereNotNull('payment_date')
            ->where('type', 'payable')
            ->sum('amount');
    }

    public function getBudgetBalanceAttribute()
    {
        return $this->budget - $this->total_spent;
    }

    public function getBudgetUsagePercentageAttribute()
    {
        if ($this->budget <= 0) return 0;
        return ($this->total_spent / $this->budget) * 100;
    }
}
