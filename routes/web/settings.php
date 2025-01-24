<?php

use App\Http\Controllers\Settings\BackupController;
use App\Http\Controllers\Settings\CompanySettingController;
use App\Http\Controllers\Settings\GeneralSettingController;
use App\Http\Controllers\Settings\UserController;
use Illuminate\Support\Facades\Route;



Route::middleware(['auth', 'verified'])->prefix('settings')->name('settings.')->group(function () {
    Route::get('general', [GeneralSettingController::class, 'index'])->name('general.index');
    Route::post('general', [GeneralSettingController::class, 'update'])->name('general.update');

    Route::get('company', [CompanySettingController::class, 'index'])->name('company.index');
    Route::post('company', [CompanySettingController::class, 'update'])->name('company.update');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('backup', [BackupController::class, 'index'])->name('backup.index');
    Route::get('backup/create', [BackupController::class, 'create'])->name('backup.create');
    Route::get('backup/{filename}/download', [BackupController::class, 'download'])->name('backup.download');
    Route::delete('backup/{filename}', [BackupController::class, 'destroy'])->name('backup.destroy');
});
