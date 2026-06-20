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

    Route::get('reports/cash-flow', [LaporanController::class, 'cashFlow'])->name('reports.cash-flow');
    Route::get('reports/cash-flow/pdf', [LaporanController::class, 'cashFlowPdf'])->name('reports.cash-flow.pdf');
    Route::get('reports/income-statement', [LaporanController::class, 'incomeStatement'])->name('reports.income-statement');
    Route::get('reports/income-statement/pdf', [LaporanController::class, 'incomeStatementPdf'])->name('reports.income-statement.pdf');
    Route::get('reports/balance-sheet', [LaporanController::class, 'balanceSheet'])->name('reports.balance-sheet');
    Route::get('reports/balance-sheet/pdf', [LaporanController::class, 'balanceSheetPdf'])->name('reports.balance-sheet.pdf');
    Route::get('reports/tax', [LaporanController::class, 'taxReport'])->name('reports.tax');
    Route::get('reports/tax/pdf', [LaporanController::class, 'taxReportPdf'])->name('reports.tax.pdf');

    // Route Write
    Route::middleware(['role:admin,finance'])->group(function () {
        // Master Data
        Route::resource('materials', BahanBakuController::class)->except(['index', 'show']);
        Route::resource('products', ProdukController::class)->except(['index', 'show']);
        Route::resource('suppliers', PemasokController::class)->except(['index', 'show']);
        Route::resource('customers', PelangganController::class)->except(['index', 'show']);
        Route::resource('equipments', PeralatanController::class)->except(['index', 'show']);
        Route::resource('payment-methods', MetodePembayaranController::class)->except(['index', 'show']);
        Route::resource('modals', ModalController::class)->except(['index', 'show']);
        Route::resource('operational-expenses', PengeluaranOperasionalController::class)->except(['index', 'show']);
        Route::resource('cash', KasController::class)->except(['index', 'show']);

        // Transaksi
        Route::resource('purchases', PembelianController::class)->except(['index', 'show']);
        Route::post('payables/{hutang}/pay', [HutangController::class, 'bayarCicilan'])->name('payables.pay');
        Route::resource('productions', ProduksiController::class)->except(['index', 'show']);
        Route::resource('stock-corrections', KoreksiStokController::class)->except(['index', 'show']);
        Route::resource('sales', PenjualanController::class)->except(['index', 'show']);
        Route::post('receivables/{piutang}/pay', [PiutangController::class, 'bayarCicilan'])->name('receivables.pay');
    });

    // Route Read
    // Master Data
    Route::resource('materials', BahanBakuController::class)->only(['index', 'show']);
    Route::resource('products', ProdukController::class)->only(['index', 'show']);
    Route::resource('suppliers', PemasokController::class)->only(['index', 'show']);
    Route::resource('customers', PelangganController::class)->only(['index', 'show']);
    Route::resource('equipments', PeralatanController::class)->only(['index', 'show']);
    Route::resource('payment-methods', MetodePembayaranController::class)->only(['index', 'show']);
    Route::resource('modals', ModalController::class)->only(['index', 'show']);
    Route::resource('operational-expenses', PengeluaranOperasionalController::class)->only(['index', 'show']);
    Route::resource('cash', KasController::class)->only(['index', 'show']);

    // Transaksi
    Route::resource('purchases', PembelianController::class)->only(['index', 'show']);
    Route::resource('payables', HutangController::class)->only(['index', 'show']);
    Route::resource('productions', ProduksiController::class)->only(['index', 'show']);
    Route::resource('stock-corrections', KoreksiStokController::class)->only(['index', 'show']);
    Route::resource('sales', PenjualanController::class)->only(['index', 'show']);
    Route::resource('receivables', PiutangController::class)->only(['index', 'show']);

    Route::middleware(['role:admin'])->group(function () {
        Route::resource('users', UserController::class);
    });
});

require __DIR__.'/settings.php';