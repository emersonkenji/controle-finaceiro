<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

    Route::get('/products', function() {
        return Inertia::render('Products/Index');
    })->name('products');

    Route::get('/sales', function() {
        return Inertia::render('Sales/Index');
    })->name('sales');

    Route::get('/financial', function() {
        return Inertia::render('Financial/Index');
    })->name('financial');

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
        return Inertia::render('Settings/Index');
    })->name('settings');
});

require __DIR__.'/auth.php';
