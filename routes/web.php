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
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderPaymentController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransactionCategoryController;
use App\Http\Controllers\CostCenterController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\FinancialDashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\CommissionController;
use App\Http\Controllers\EmployeeHistoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReportCommentController;
use App\Http\Controllers\PdvController;
use App\Http\Controllers\ReceivableController;
use App\Http\Controllers\PayableController;
use App\Http\Controllers\CashFlowController;
use App\Http\Controllers\DREController;
use App\Http\Controllers\BankReconciliationController;

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

    // Rotas de Categorias de Clientes
    Route::get('/customers/categories', [CustomerCategoryController::class, 'index'])->name('customers.categories.index');
    Route::get('/customers/categories/create', [CustomerCategoryController::class, 'create'])->name('customers.categories.create');
    Route::post('/customers/categories', [CustomerCategoryController::class, 'store'])->name('customers.categories.store');
    Route::get('/customers/categories/{category}/edit', [CustomerCategoryController::class, 'edit'])->name('customers.categories.edit');
    Route::put('/customers/categories/{category}', [CustomerCategoryController::class, 'update'])->name('customers.categories.update');
    Route::delete('/customers/categories/{category}', [CustomerCategoryController::class, 'destroy'])->name('customers.categories.destroy');

    // Rotas de Histórico de Clientes
    Route::get('/customers/{customer}/history', [CustomerHistoryController::class, 'index'])->name('customers.history.index');
    Route::post('/customers/{customer}/history', [CustomerHistoryController::class, 'store'])->name('customers.history.store');
    Route::delete('/customers/{customer}/history/{history}', [CustomerHistoryController::class, 'destroy'])->name('customers.history.destroy');

    // Rotas de Documentos de Clientes
    Route::get('/customers/{customer}/documents', [CustomerDocumentController::class, 'index'])->name('customers.documents.index');
    Route::post('/customers/{customer}/documents', [CustomerDocumentController::class, 'store'])->name('customers.documents.store');
    Route::delete('/customers/{customer}/documents/{document}', [CustomerDocumentController::class, 'destroy'])->name('customers.documents.destroy');
    Route::get('/customers/{customer}/documents/{document}/download', [CustomerDocumentController::class, 'download'])->name('customers.documents.download');

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

    // Rotas de Configurações
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // Rotas de Vendas
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::get('/create', [OrderController::class, 'create'])->name('create');
        Route::post('/', [OrderController::class, 'store'])->name('store');
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        Route::post('/{order}/cancel', [OrderController::class, 'cancel'])->name('cancel');
        Route::get('/{order}/print', [OrderController::class, 'print'])->name('print');
    });

    // PDV
    Route::prefix('pdv')->name('pdv.')->group(function () {
        Route::get('/', [PdvController::class, 'index'])->name('index');
        Route::post('/', [PdvController::class, 'store'])->name('store');
        Route::get('/print/{order}', [PdvController::class, 'print'])->name('print');
    });

    // Rotas de Pagamentos
    Route::get('/orders/{order}/payments', [OrderPaymentController::class, 'index'])->name('payments.index');
    Route::post('/orders/{order}/payments', [OrderPaymentController::class, 'store'])->name('payments.store');
    Route::put('/orders/{order}/payments/{payment}', [OrderPaymentController::class, 'update'])->name('payments.update');
    Route::delete('/orders/{order}/payments/{payment}', [OrderPaymentController::class, 'destroy'])->name('payments.destroy');

    // Rotas do Módulo Financeiro
    Route::prefix('financial')->name('financial.')->middleware(['auth', 'verified'])->group(function () {
        // Dashboard Financeiro
        Route::get('/dashboard', [FinancialDashboardController::class, 'index'])->name('dashboard');

        // Contas a Receber
        Route::resource('receivables', ReceivableController::class);

        // Contas a Pagar
        Route::resource('payables', PayableController::class);

        // Fluxo de Caixa
        Route::get('/cash-flow', [CashFlowController::class, 'index'])->name('cash-flow');
        Route::get('/cash-flow/export', [CashFlowController::class, 'export'])->name('cash-flow.export');

        // DRE
        Route::get('/dre', [DREController::class, 'index'])->name('dre');
        Route::get('/dre/export', [DREController::class, 'export'])->name('dre.export');

        // Conciliação Bancária
        Route::resource('bank-reconciliation', BankReconciliationController::class);

        // Centro de Custos
        Route::resource('cost-centers', CostCenterController::class);
    });

    // Rotas de Funcionários
    Route::prefix('employees')->middleware('auth')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('employees.index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('employees.create');
        Route::post('/', [EmployeeController::class, 'store'])->name('employees.store');
        Route::get('/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
        Route::get('/{employee}/performance', [EmployeeController::class, 'performance'])->name('employees.performance');

        // Rotas de Comissões
        Route::get('/commissions', [CommissionController::class, 'index'])->name('employees.commissions.index');
        Route::post('/commissions', [CommissionController::class, 'store'])->name('employees.commissions.store');
        Route::put('/commissions/{commission}', [CommissionController::class, 'update'])->name('employees.commissions.update');
        Route::delete('/commissions/{commission}', [CommissionController::class, 'destroy'])->name('employees.commissions.destroy');
        Route::post('/commissions/calculate/{order}', [CommissionController::class, 'calculateForOrder'])->name('employees.commissions.calculate');
        Route::post('/commissions/pay', [CommissionController::class, 'payMultiple'])->name('employees.commissions.pay');

        // Rotas de Histórico
        Route::get('/{employee}/history', [EmployeeHistoryController::class, 'index'])->name('employees.history.index');
        Route::post('/{employee}/history', [EmployeeHistoryController::class, 'store'])->name('employees.history.store');
        Route::delete('/{employee}/history/{history}', [EmployeeHistoryController::class, 'destroy'])->name('employees.history.destroy');
    });

    // Rotas de relatórios
    Route::middleware(['auth'])->group(function () {
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
        Route::get('/reports/{report}', [ReportController::class, 'show'])->name('reports.show');
        Route::get('/reports/{report}/download', [ReportController::class, 'download'])->name('reports.download');

        // Rotas de comentários de relatórios
        Route::post('/reports/{report}/comments', [ReportCommentController::class, 'store'])->name('reports.comments.store');
        Route::put('/reports/{report}/comments/{comment}', [ReportCommentController::class, 'update'])->name('reports.comments.update');
        Route::delete('/reports/{report}/comments/{comment}', [ReportCommentController::class, 'destroy'])->name('reports.comments.destroy');
    });
});

require __DIR__.'/auth.php';
