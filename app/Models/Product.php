<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category_id',
        'sku',
        'barcode',
        'price',
        'cost_price',
        'stock',
        'min_stock',
        'status',
        'attributes'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'attributes' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
            if (empty($product->sku)) {
                $product->sku = strtoupper(uniqid());
            }
            if (empty($product->status)) {
                $product->status = 'active';
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(ProductStockMovement::class);
    }

    public function priceHistories()
    {
        return $this->hasMany(ProductPriceHistory::class);
    }

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function getFormattedPriceAttribute()
    {
        return 'R$ ' . number_format($this->price, 2, ',', '.');
    }

    public function getFormattedCostPriceAttribute()
    {
        return 'R$ ' . number_format($this->cost_price, 2, ',', '.');
    }

    public function getFormattedStatusAttribute()
    {
        return match ($this->status) {
            'active' => 'Ativo',
            'inactive' => 'Inativo',
            default => ucfirst($this->status),
        };
    }
}
