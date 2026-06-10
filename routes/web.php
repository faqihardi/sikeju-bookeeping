<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\PemasokController;
use App\Http\Controllers\PelangganController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('materials', BahanBakuController::class);
    Route::resource('products', ProdukController::class);
    Route::resource('suppliers', PemasokController::class);
    Route::resource('customers', PelangganController::class);
});

require __DIR__.'/settings.php';
