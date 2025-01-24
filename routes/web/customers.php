<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customers\CustomerController;
use App\Http\Controllers\Customers\CustomerHistoryController;
use App\Http\Controllers\Customers\CustomerCategoryController;
use App\Http\Controllers\Customers\CustomerDocumentController;

// Rotas de Clientes
Route::middleware(['auth', 'verified'])->group(function () {
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
});
