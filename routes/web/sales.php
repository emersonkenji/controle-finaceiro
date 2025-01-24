<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Sales\PdvController;
use App\Http\Controllers\Sales\OrderController;
use App\Http\Controllers\Sales\OrderPaymentController;


// Rotas de Vendas
Route::middleware(['auth', 'verified'])->group(function () {
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
});
