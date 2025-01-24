<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Financial\DREController;
use App\Http\Controllers\Financial\PayableController;
use App\Http\Controllers\Financial\CashFlowController;
use App\Http\Controllers\Financial\CostCenterController;
use App\Http\Controllers\Financial\ReceivableController;
use App\Http\Controllers\Financial\BankReconciliationController;
use App\Http\Controllers\Financial\FinancialDashboardController;

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
