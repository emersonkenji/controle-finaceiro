<?php

// Rotas de Relatórios
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\Reports\SalesReportController;
use App\Http\Controllers\Reports\ProductReportController;
use App\Http\Controllers\Reports\ReportCommentController;
use App\Http\Controllers\Reports\CustomerReportController;
use App\Http\Controllers\Reports\FinancialReportController;
use App\Http\Controllers\Reports\InventoryReportController;

Route::middleware(['auth', 'verified'])->prefix('reports')->name('reports.')->group(function () {
    // Rota principal
    Route::get('/', [ReportController::class, 'index'])->name('index');

    // Rotas específicas de relatórios (devem vir antes das rotas com parâmetros)
    Route::get('/sales', [SalesReportController::class, 'index'])->name('sales.index');
    Route::get('/financial', [FinancialReportController::class, 'index'])->name('financial.index');
    Route::get('/inventory', [InventoryReportController::class, 'index'])->name('inventory.index');
    Route::get('/customers', [CustomerReportController::class, 'index'])->name('customers.index');
    Route::get('/products', [ProductReportController::class, 'index'])->name('products.index');

    // Rotas com parâmetros (devem vir depois das rotas específicas)
    Route::post('/', [ReportController::class, 'store'])->name('store');
    Route::get('/{report}', [ReportController::class, 'show'])->name('show');
    Route::get('/{report}/download', [ReportController::class, 'download'])->name('download');

    // Rotas de comentários de relatórios
    Route::post('/{report}/comments', [ReportCommentController::class, 'store'])->name('comments.store');
    Route::put('/{report}/comments/{comment}', [ReportCommentController::class, 'update'])->name('comments.update');
    Route::delete('/{report}/comments/{comment}', [ReportCommentController::class, 'destroy'])->name('comments.destroy');
});
