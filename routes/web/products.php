<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Products\CarrierController;
use App\Http\Controllers\Products\ProductController;
use App\Http\Controllers\Products\DeliveryController;
use App\Http\Controllers\Products\ProductImageController;
use App\Http\Controllers\Products\ProductStockController;
use App\Http\Controllers\Products\ProductCategoryController;
use App\Http\Controllers\Products\ProductVariationController;

// Rotas de Produtos
Route::middleware(['auth', 'verified'])->group(function () {
    // Categorias de Produtos
    Route::get('/products/categories', [ProductCategoryController::class, 'index'])->name('products.categories.index');
    Route::post('/products/categories', [ProductCategoryController::class, 'store'])->name('products.categories.store');
    Route::get('/products/categories/{category}/edit', [ProductCategoryController::class, 'edit'])->name('products.categories.edit');
    Route::put('/products/categories/{category}', [ProductCategoryController::class, 'update'])->name('products.categories.update');
    Route::delete('/products/categories/{category}', [ProductCategoryController::class, 'destroy'])->name('products.categories.destroy');

    // Estoque de Produtos
    Route::get('/products/stock/alerts', [ProductStockController::class, 'alerts'])->name('products.stock.alerts');
    Route::post('/products/stock/transfer', [ProductStockController::class, 'transfer'])->name('products.stock.transfer');
    Route::get('/products/{product}/stock', [ProductStockController::class, 'index'])->name('products.stock.index');
    Route::post('/products/{product}/stock/adjust', [ProductStockController::class, 'adjust'])->name('products.stock.adjust');
    Route::get('/products/{product}/stock/history', [ProductStockController::class, 'history'])->name('products.stock.history');

    // Logística
    Route::prefix('logistics')->name('logistics.')->group(function () {
        Route::resource('deliveries', DeliveryController::class);
        Route::resource('carriers', CarrierController::class);
        Route::get('tracking', [DeliveryController::class, 'tracking'])->name('tracking');
    });

    // Produtos
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/products/{product}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
    Route::post('/products/export', [ProductController::class, 'export'])->name('products.export');

    // Variações de Produtos
    Route::get('/products/{product}/variations', [ProductVariationController::class, 'index'])->name('products.variations.index');
    Route::post('/products/{product}/variations', [ProductVariationController::class, 'store'])->name('products.variations.store');
    Route::put('/products/{product}/variations/{variation}', [ProductVariationController::class, 'update'])->name('products.variations.update');
    Route::delete('/products/{product}/variations/{variation}', [ProductVariationController::class, 'destroy'])->name('products.variations.destroy');

    // Imagens de Produtos
    Route::delete('/products/images/{image}', [ProductImageController::class, 'destroy'])->name('products.images.destroy');
    Route::post('/products/images/{image}/main', [ProductImageController::class, 'setMain'])->name('products.images.main');
    Route::post('/products/images/reorder', [ProductImageController::class, 'reorder'])->name('products.images.reorder');
});
