<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductStockMovement extends Model
{
    use HasFactory;

    protected $table = 'stock_movements';  // Adicione esta linha

    protected $fillable = [
        'product_id',
        'product_variation_id',
        'type',
        'quantity',
        'reference_type',
        'reference_id',
        'description',
        'unit_cost',
        'user_id'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_cost' => 'decimal:2'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variation()
    {
        return $this->belongsTo(ProductVariation::class, 'product_variation_id');
    }

    public function reference()
    {
        return $this->morphTo();
    }
}
