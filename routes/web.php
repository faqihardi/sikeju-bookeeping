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
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\HutangController;
use App\Http\Controllers\ProduksiController;
use App\Http\Controllers\KoreksiStokController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\PiutangController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('materials', BahanBakuController::class);
    Route::resource('products', ProdukController::class);
    Route::resource('suppliers', PemasokController::class);
    Route::resource('customers', PelangganController::class);
    Route::resource('equipments', PeralatanController::class);
    Route::resource('payment-methods', MetodePembayaranController::class);
    Route::resource('modals', ModalController::class);
    Route::resource('operational-expenses', PengeluaranOperasionalController::class);
    Route::resource('cash', KasController::class);

    Route::resource('purchases', PembelianController::class);
    Route::resource('payables', HutangController::class);
    Route::post('payables/{hutang}/pay', [HutangController::class, 'bayarCicilan'])->name('payables.pay');

    Route::resource('productions', ProduksiController::class);
    Route::resource('stock-corrections', KoreksiStokController::class);

    Route::resource('sales', PenjualanController::class);
    Route::resource('receivables', PiutangController::class);
    Route::post('receivables/{piutang}/pay', [PiutangController::class, 'bayarCicilan'])->name('receivables.pay');

    Route::get('reports/cash-flow', [LaporanController::class, 'cashFlow'])->name('reports.cash-flow');
    Route::get('reports/cash-flow/pdf', [LaporanController::class, 'cashFlowPdf'])->name('reports.cash-flow.pdf');
    Route::get('reports/income-statement', [LaporanController::class, 'incomeStatement'])->name('reports.income-statement');
    Route::get('reports/income-statement/pdf', [LaporanController::class, 'incomeStatementPdf'])->name('reports.income-statement.pdf');
    Route::get('reports/balance-sheet', [LaporanController::class, 'balanceSheet'])->name('reports.balance-sheet');
    Route::get('reports/balance-sheet/pdf', [LaporanController::class, 'balanceSheetPdf'])->name('reports.balance-sheet.pdf');
    Route::get('reports/tax', [LaporanController::class, 'taxReport'])->name('reports.tax');
    Route::get('reports/tax/pdf', [LaporanController::class, 'taxReportPdf'])->name('reports.tax.pdf');

    // Route Admin
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('users', UserController::class);
    });
});

require __DIR__.'/settings.php';
