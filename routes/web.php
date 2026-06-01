<?php

use App\Http\Controllers\PembayaranHutangController;
use App\Http\Controllers\PembayaranPiutangController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::post('pembayaran-hutang', [PembayaranHutangController::class, 'store'])
        ->name('pembayaran-hutang.store');

    Route::post('pembayaran-piutang', [PembayaranPiutangController::class, 'store'])
        ->name('pembayaran-piutang.store');
});

require __DIR__.'/settings.php';
