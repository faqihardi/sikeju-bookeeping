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

    // -----------------------------------------------------------------------
    // Routes yang bisa diakses semua role (READ ONLY untuk owner)
    // -----------------------------------------------------------------------
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Master Data – index (semua role bisa baca)
    Route::get('materials', [BahanBakuController::class, 'index'])->name('materials.index');
    Route::get('products', [ProdukController::class, 'index'])->name('products.index');
    Route::get('suppliers', [PemasokController::class, 'index'])->name('suppliers.index');
    Route::get('customers', [PelangganController::class, 'index'])->name('customers.index');
    Route::get('equipments', [PeralatanController::class, 'index'])->name('equipments.index');
    Route::get('payment-methods', [MetodePembayaranController::class, 'index'])->name('payment-methods.index');
    Route::get('modals', [ModalController::class, 'index'])->name('modals.index');
    Route::get('operational-expenses', [PengeluaranOperasionalController::class, 'index'])->name('operational-expenses.index');
    Route::get('cash', [KasController::class, 'index'])->name('cash.index');

    // Transaksi – index
    Route::get('purchases', [PembelianController::class, 'index'])->name('purchases.index');
    Route::get('payables', [HutangController::class, 'index'])->name('payables.index');
    Route::get('productions', [ProduksiController::class, 'index'])->name('productions.index');
    Route::get('stock-corrections', [KoreksiStokController::class, 'index'])->name('stock-corrections.index');
    Route::get('sales', [PenjualanController::class, 'index'])->name('sales.index');
    Route::get('receivables', [PiutangController::class, 'index'])->name('receivables.index');

    // Laporan (semua role bisa akses, termasuk owner)
    Route::get('reports/cash-flow', [LaporanController::class, 'cashFlow'])->name('reports.cash-flow');
    Route::get('reports/cash-flow/pdf', [LaporanController::class, 'cashFlowPdf'])->name('reports.cash-flow.pdf');
    Route::get('reports/income-statement', [LaporanController::class, 'incomeStatement'])->name('reports.income-statement');
    Route::get('reports/income-statement/pdf', [LaporanController::class, 'incomeStatementPdf'])->name('reports.income-statement.pdf');
    Route::get('reports/balance-sheet', [LaporanController::class, 'balanceSheet'])->name('reports.balance-sheet');
    Route::get('reports/balance-sheet/pdf', [LaporanController::class, 'balanceSheetPdf'])->name('reports.balance-sheet.pdf');
    Route::get('reports/tax', [LaporanController::class, 'taxReport'])->name('reports.tax');
    Route::get('reports/tax/pdf', [LaporanController::class, 'taxReportPdf'])->name('reports.tax.pdf');

    // -----------------------------------------------------------------------
    // Routes WRITE – hanya admin & finance (owner TIDAK bisa akses)
    // -----------------------------------------------------------------------
    Route::middleware(['role:admin,finance'])->group(function () {
        // Master Data – create/store/edit/update/destroy
        Route::get('materials/create', [BahanBakuController::class, 'create'])->name('materials.create');
        Route::post('materials', [BahanBakuController::class, 'store'])->name('materials.store');
        Route::get('materials/{material}/edit', [BahanBakuController::class, 'edit'])->name('materials.edit');
        Route::put('materials/{material}', [BahanBakuController::class, 'update'])->name('materials.update');
        Route::delete('materials/{material}', [BahanBakuController::class, 'destroy'])->name('materials.destroy');

        Route::get('products/create', [ProdukController::class, 'create'])->name('products.create');
        Route::post('products', [ProdukController::class, 'store'])->name('products.store');
        Route::get('products/{product}/edit', [ProdukController::class, 'edit'])->name('products.edit');
        Route::put('products/{product}', [ProdukController::class, 'update'])->name('products.update');
        Route::delete('products/{product}', [ProdukController::class, 'destroy'])->name('products.destroy');

        Route::get('suppliers/create', [PemasokController::class, 'create'])->name('suppliers.create');
        Route::post('suppliers', [PemasokController::class, 'store'])->name('suppliers.store');
        Route::get('suppliers/{supplier}/edit', [PemasokController::class, 'edit'])->name('suppliers.edit');
        Route::put('suppliers/{supplier}', [PemasokController::class, 'update'])->name('suppliers.update');
        Route::delete('suppliers/{supplier}', [PemasokController::class, 'destroy'])->name('suppliers.destroy');

        Route::get('customers/create', [PelangganController::class, 'create'])->name('customers.create');
        Route::post('customers', [PelangganController::class, 'store'])->name('customers.store');
        Route::get('customers/{customer}/edit', [PelangganController::class, 'edit'])->name('customers.edit');
        Route::put('customers/{customer}', [PelangganController::class, 'update'])->name('customers.update');
        Route::delete('customers/{customer}', [PelangganController::class, 'destroy'])->name('customers.destroy');

        Route::get('equipments/create', [PeralatanController::class, 'create'])->name('equipments.create');
        Route::post('equipments', [PeralatanController::class, 'store'])->name('equipments.store');
        Route::get('equipments/{equipment}/edit', [PeralatanController::class, 'edit'])->name('equipments.edit');
        Route::put('equipments/{equipment}', [PeralatanController::class, 'update'])->name('equipments.update');
        Route::delete('equipments/{equipment}', [PeralatanController::class, 'destroy'])->name('equipments.destroy');

        Route::get('payment-methods/create', [MetodePembayaranController::class, 'create'])->name('payment-methods.create');
        Route::post('payment-methods', [MetodePembayaranController::class, 'store'])->name('payment-methods.store');
        Route::get('payment-methods/{payment_method}/edit', [MetodePembayaranController::class, 'edit'])->name('payment-methods.edit');
        Route::put('payment-methods/{payment_method}', [MetodePembayaranController::class, 'update'])->name('payment-methods.update');
        Route::delete('payment-methods/{payment_method}', [MetodePembayaranController::class, 'destroy'])->name('payment-methods.destroy');

        Route::get('modals/create', [ModalController::class, 'create'])->name('modals.create');
        Route::post('modals', [ModalController::class, 'store'])->name('modals.store');
        Route::get('modals/{modal}/edit', [ModalController::class, 'edit'])->name('modals.edit');
        Route::put('modals/{modal}', [ModalController::class, 'update'])->name('modals.update');
        Route::delete('modals/{modal}', [ModalController::class, 'destroy'])->name('modals.destroy');

        Route::get('operational-expenses/create', [PengeluaranOperasionalController::class, 'create'])->name('operational-expenses.create');
        Route::post('operational-expenses', [PengeluaranOperasionalController::class, 'store'])->name('operational-expenses.store');
        Route::get('operational-expenses/{operational_expense}/edit', [PengeluaranOperasionalController::class, 'edit'])->name('operational-expenses.edit');
        Route::put('operational-expenses/{operational_expense}', [PengeluaranOperasionalController::class, 'update'])->name('operational-expenses.update');
        Route::delete('operational-expenses/{operational_expense}', [PengeluaranOperasionalController::class, 'destroy'])->name('operational-expenses.destroy');

        Route::get('cash/create', [KasController::class, 'create'])->name('cash.create');
        Route::post('cash', [KasController::class, 'store'])->name('cash.store');
        Route::delete('cash/{cash}', [KasController::class, 'destroy'])->name('cash.destroy');

        // Transaksi – create/store/destroy
        Route::get('purchases/create', [PembelianController::class, 'create'])->name('purchases.create');
        Route::post('purchases', [PembelianController::class, 'store'])->name('purchases.store');
        Route::delete('purchases/{purchase}', [PembelianController::class, 'destroy'])->name('purchases.destroy');

        Route::post('payables/{hutang}/pay', [HutangController::class, 'bayarCicilan'])->name('payables.pay');

        Route::get('productions/create', [ProduksiController::class, 'create'])->name('productions.create');
        Route::post('productions', [ProduksiController::class, 'store'])->name('productions.store');
        Route::delete('productions/{production}', [ProduksiController::class, 'destroy'])->name('productions.destroy');

        Route::get('stock-corrections/create', [KoreksiStokController::class, 'create'])->name('stock-corrections.create');
        Route::post('stock-corrections', [KoreksiStokController::class, 'store'])->name('stock-corrections.store');
        Route::delete('stock-corrections/{stock_correction}', [KoreksiStokController::class, 'destroy'])->name('stock-corrections.destroy');

        Route::get('sales/create', [PenjualanController::class, 'create'])->name('sales.create');
        Route::post('sales', [PenjualanController::class, 'store'])->name('sales.store');
        Route::delete('sales/{sale}', [PenjualanController::class, 'destroy'])->name('sales.destroy');

        Route::post('receivables/{piutang}/pay', [PiutangController::class, 'bayarCicilan'])->name('receivables.pay');
    });

    // -----------------------------------------------------------------------
    // Routes SHOW – (semua role bisa baca parameter ID)
    // HARUS di bawah 'create' route agar /create tidak terdeteksi sebagai {id}
    // -----------------------------------------------------------------------
    Route::get('materials/{material}', [BahanBakuController::class, 'show'])->name('materials.show');
    Route::get('products/{product}', [ProdukController::class, 'show'])->name('products.show');
    Route::get('suppliers/{supplier}', [PemasokController::class, 'show'])->name('suppliers.show');
    Route::get('customers/{customer}', [PelangganController::class, 'show'])->name('customers.show');
    Route::get('equipments/{equipment}', [PeralatanController::class, 'show'])->name('equipments.show');
    Route::get('payment-methods/{payment_method}', [MetodePembayaranController::class, 'show'])->name('payment-methods.show');
    Route::get('modals/{modal}', [ModalController::class, 'show'])->name('modals.show');
    Route::get('operational-expenses/{operational_expense}', [PengeluaranOperasionalController::class, 'show'])->name('operational-expenses.show');
    Route::get('cash/{cash}', [KasController::class, 'show'])->name('cash.show');

    Route::get('purchases/{purchase}', [PembelianController::class, 'show'])->name('purchases.show');
    Route::get('payables/{payable}', [HutangController::class, 'show'])->name('payables.show');
    Route::get('productions/{production}', [ProduksiController::class, 'show'])->name('productions.show');
    Route::get('stock-corrections/{stock_correction}', [KoreksiStokController::class, 'show'])->name('stock-corrections.show');
    Route::get('sales/{sale}', [PenjualanController::class, 'show'])->name('sales.show');
    Route::get('receivables/{receivable}', [PiutangController::class, 'show'])->name('receivables.show');

    // -----------------------------------------------------------------------
    // Route Admin only – manajemen pengguna
    // -----------------------------------------------------------------------
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('users', UserController::class);
    });
});

require __DIR__.'/settings.php';
