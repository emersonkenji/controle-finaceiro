<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'document',
        'birth_date',
        'hire_date',
        'termination_date',
        'position',
        'department',
        'salary',
        'commission_rate',
        'status',
        'notes',
        'user_id'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'hire_date' => 'date',
        'termination_date' => 'date',
        'salary' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'status' => 'boolean'
    ];

    // Relacionamento com o usuário do sistema
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacionamento com as vendas
    public function sales()
    {
        return $this->hasMany(Order::class);
    }

    // Relacionamento com as comissões
    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }

    // Relacionamento com o histórico
    public function history()
    {
        return $this->hasMany(EmployeeHistory::class);
    }

    // Relacionamento com os documentos
    public function documents()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    // Escopo para funcionários ativos
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    // Método para calcular o total de vendas
    public function totalSales($startDate = null, $endDate = null)
    {
        $query = $this->sales();

        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        return $query->sum('total');
    }

    // Método para calcular o total de comissões
    public function totalCommissions($startDate = null, $endDate = null)
    {
        $query = $this->commissions();

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return $query->sum('amount');
    }
}
