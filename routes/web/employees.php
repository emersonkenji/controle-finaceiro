<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Employees\EmployeeController;
use App\Http\Controllers\Employees\CommissionController;
use App\Http\Controllers\Employees\EmployeeHistoryController;

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
