<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\BahanBakuController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('materials', BahanBakuController::class);
});

require __DIR__.'/settings.php';
