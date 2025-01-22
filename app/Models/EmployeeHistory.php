<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class EmployeeHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'type',
        'description',
        'date',
        'data',
        'user_id'
    ];

    protected $casts = [
        'date' => 'datetime',
        'data' => 'array'
    ];

    // Relacionamento com o funcionário
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    // Relacionamento com o usuário que registrou o histórico
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacionamento com os documentos
    public function documents()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
