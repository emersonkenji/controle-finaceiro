<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerCategoryController;
use App\Http\Controllers\CustomerHistoryController;
use App\Http\Controllers\CustomerDocumentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductVariationController;
use App\Http\Controllers\ProductStockController;
use App\Http\Controllers\ProductExportController;
use App\Http\Controllers\ProductImageController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rotas do sistema
    Route::get('/clients', function() {
        return Inertia::render('Clients/Index');
    })->name('clients');

    Route::get('/clients/create', function() {
        return Inertia::render('Clients/Create');
    })->name('clients.create');

    Route::get('/products', function() {
        return Inertia::render('Products/Index');
    })->name('products');

    Route::get('/products/create', function() {
        return Inertia::render('Products/Create');
    })->name('products.create');

    Route::get('/sales', function() {
        return Inertia::render('Sales/Index');
    })->name('sales');

    Route::get('/financial', function() {
        return Inertia::render('Financial/Index');
    })->name('financial');

    Route::get('/financial/receivables', function() {
        return Inertia::render('Financial/Receivables');
    })->name('financial.receivables');

    Route::get('/financial/payables', function() {
        return Inertia::render('Financial/Payables');
    })->name('financial.payables');

    Route::get('/financial/cash-flow', function() {
        return Inertia::render('Financial/CashFlow');
    })->name('financial.cash-flow');

    Route::get('/financial/dre', function() {
        return Inertia::render('Financial/DRE');
    })->name('financial.dre');

    Route::get('/financial/bank-reconciliation', function() {
        return Inertia::render('Financial/BankReconciliation');
    })->name('financial.bank-reconciliation');

    Route::get('/financial/cost-center', function() {
        return Inertia::render('Financial/CostCenter');
    })->name('financial.cost-center');

    Route::get('/financial/dashboard', function() {
        return Inertia::render('Financial/Dashboard');
    })->name('financial.dashboard');

    Route::get('/employees', function() {
        return Inertia::render('Employees/Index');
    })->name('employees');

    Route::get('/logistics', function() {
        return Inertia::render('Logistics/Index');
    })->name('logistics');

    Route::get('/reports', function() {
        return Inertia::render('Reports/Index');
    })->name('reports');

    Route::get('/settings', function() {
        return Inertia::render('Settings');
    })->name('settings');

    // Rotas de Clientes
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/create', [CustomerController::class, 'create'])->name('customers.create');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    // Rotas adicionais para clientes
    Route::get('/customers/categories', [CustomerCategoryController::class, 'index'])->name('customers.categories.index');
    Route::get('/customers/{customer}/history', [CustomerHistoryController::class, 'index'])->name('customers.history.index');
    Route::get('/customers/{customer}/documents', [CustomerDocumentController::class, 'index'])->name('customers.documents.index');

    // Rotas de Produtos
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

        // Rotas de Categorias de Produtos
        Route::get('/products/categories', [ProductCategoryController::class, 'index'])->name('products.categories.index');
        Route::get('/products/categories/create', [ProductCategoryController::class, 'create'])->name('products.categories.create');
        Route::post('/products/categories', [ProductCategoryController::class, 'store'])->name('products.categories.store');
        Route::get('/products/categories/{category}/edit', [ProductCategoryController::class, 'edit'])->name('products.categories.edit');
        Route::put('/products/categories/{category}', [ProductCategoryController::class, 'update'])->name('products.categories.update');
        Route::delete('/products/categories/{category}', [ProductCategoryController::class, 'destroy'])->name('products.categories.destroy');

        // Rotas de Variações de Produtos
        Route::get('/products/{product}/variations', [ProductVariationController::class, 'index'])->name('products.variations.index');
        Route::post('/products/{product}/variations', [ProductVariationController::class, 'store'])->name('products.variations.store');
        Route::put('/products/{product}/variations/{variation}', [ProductVariationController::class, 'update'])->name('products.variations.update');
        Route::delete('/products/{product}/variations/{variation}', [ProductVariationController::class, 'destroy'])->name('products.variations.destroy');

        // Rotas de Estoque
        Route::get('/products/{product}/stock', [ProductStockController::class, 'index'])->name('products.stock.index');
        Route::post('/products/{product}/stock/adjust', [ProductStockController::class, 'adjust'])->name('products.stock.adjust');
        Route::get('/products/{product}/stock/history', [ProductStockController::class, 'history'])->name('products.stock.history');

        // Adicionar dentro do grupo de rotas de produtos
        Route::post('/products/export', ProductExportController::class)->name('products.export');

        // Adicionar dentro do grupo de rotas de produtos
        Route::delete('/products/images/{image}', [ProductImageController::class, 'destroy'])->name('products.images.destroy');
        Route::post('/products/images/{image}/main', [ProductImageController::class, 'setMain'])->name('products.images.main');

        // Adicionar junto com as outras rotas de imagens
        Route::post('/products/images/reorder', [ProductImageController::class, 'reorder'])->name('products.images.reorder');

        // Rota para duplicação de produtos
        Route::post('/products/{product}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
    });
});

require __DIR__.'/auth.php';
