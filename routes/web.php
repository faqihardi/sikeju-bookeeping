<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\PemasokController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PeralatanController;
use App\Http\Controllers\MetodePembayaranController;
use App\Http\Controllers\ModalController;
use App\Http\Controllers\PengeluaranOperasionalController;
use App\Http\Controllers\KasController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('materials', BahanBakuController::class);
    Route::resource('products', ProdukController::class);
    Route::resource('suppliers', PemasokController::class);
    Route::resource('customers', PelangganController::class);
    Route::resource('equipments', PeralatanController::class);
    Route::resource('payment-methods', MetodePembayaranController::class);
    Route::resource('modals', ModalController::class);
    Route::resource('operational-expenses', PengeluaranOperasionalController::class);
    Route::resource('cash', KasController::class);
});

require __DIR__.'/settings.php';
