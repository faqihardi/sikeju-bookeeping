<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Models\Penjualan;
use App\Models\PengeluaranOperasional;
use App\Models\BahanBaku;
use App\Models\Produk;
use App\Models\Peralatan;
use App\Models\Hutang;
use App\Models\Piutang;
use App\Models\Modal;
use App\Models\PembayaranHutang;
use App\Models\PembayaranPiutang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function cashFlow(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        // 1. Saldo Awal Kas
        $saldoAwal = Kas::where('tanggal', '<', $startDate)->sum('masuk') 
            - Kas::where('tanggal', '<', $startDate)->sum('keluar');

        // 2. Arus Kas Masuk
        $inflows = Kas::whereBetween('tanggal', [$startDate, $endDate])
            ->where('masuk', '>', 0)
            ->selectRaw('sumber, SUM(masuk) as total')
            ->groupBy('sumber')
            ->get()
            ->pluck('total', 'sumber')
            ->toArray();

        // 3. Arus Kas Keluar
        $outflows = Kas::whereBetween('tanggal', [$startDate, $endDate])
            ->where('keluar', '>', 0)
            ->selectRaw('sumber, SUM(keluar) as total')
            ->groupBy('sumber')
            ->get()
            ->pluck('total', 'sumber')
            ->toArray();

        // Ensure all possible sources are in arrays
        $sourcesIn = ['penjualan', 'piutang', 'modal', 'lainnya'];
        $sourcesOut = ['pembelian', 'hutang', 'operasional', 'peralatan', 'lainnya'];

        $formattedInflows = [];
        $totalInflow = 0;
        foreach ($sourcesIn as $src) {
            $val = (float)($inflows[$src] ?? 0);
            $formattedInflows[$src] = $val;
            $totalInflow += $val;
        }

        $formattedOutflows = [];
        $totalOutflow = 0;
        foreach ($sourcesOut as $src) {
            $val = (float)($outflows[$src] ?? 0);
            $formattedOutflows[$src] = $val;
            $totalOutflow += $val;
        }

        $saldoAkhir = $saldoAwal + $totalInflow - $totalOutflow;

        return Inertia::render('Reports/CashFlow', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'saldoAwal' => $saldoAwal,
            'inflows' => $formattedInflows,
            'outflows' => $formattedOutflows,
            'totalInflow' => $totalInflow,
            'totalOutflow' => $totalOutflow,
            'saldoAkhir' => $saldoAkhir,
        ]);
    }

    public function incomeStatement(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        // 1. Pendapatan Penjualan
        $pendapatan = (float) Penjualan::whereBetween(DB::raw('DATE(created_at)'), [$startDate, $endDate])->sum('total');

        // 2. Harga Pokok Penjualan (HPP)
        $hpp = (float) DB::table('detail_penjualans')
            ->join('penjualans', 'detail_penjualans.penjualan_id', '=', 'penjualans.id')
            ->join('produks', 'detail_penjualans.produk_id', '=', 'produks.id')
            ->whereBetween(DB::raw('DATE(penjualans.created_at)'), [$startDate, $endDate])
            ->sum(DB::raw('detail_penjualans.qty * produks.hpp'));

        // 3. Laba Kotor
        $labaKotor = $pendapatan - $hpp;

        // 4. Beban Operasional
        $operasional = (float) PengeluaranOperasional::whereBetween('tanggal', [$startDate, $endDate])->sum('nominal');

        // 5. Laba Bersih
        $labaBersih = $labaKotor - $operasional;

        return Inertia::render('Reports/IncomeStatement', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'pendapatan' => $pendapatan,
            'hpp' => $hpp,
            'labaKotor' => $labaKotor,
            'operasional' => $operasional,
            'labaBersih' => $labaBersih,
        ]);
    }

    public function balanceSheet(Request $request)
    {
        $date = $request->input('date', Carbon::now()->toDateString());

        // 1. ASET (HARTA)
        // a. Aset Lancar
        $kas = (float) (Kas::where('tanggal', '<=', $date)->sum('masuk') 
            - Kas::where('tanggal', '<=', $date)->sum('keluar'));

        $totalPiutang = Piutang::where(DB::raw('DATE(created_at)'), '<=', $date)->sum('nominal');
        $totalPembayaranPiutang = PembayaranPiutang::where('tanggal', '<=', $date)->sum('nominal_bayar');
        $piutang = (float) ($totalPiutang - $totalPembayaranPiutang);

        $persediaanBahan = (float) BahanBaku::sum(DB::raw('stok * harga_satuan'));
        $persediaanProduk = (float) Produk::sum(DB::raw('stok * hpp'));

        $totalAsetLancar = $kas + $piutang + $persediaanBahan + $persediaanProduk;

        // b. Aset Tetap
        $peralatan = (float) Peralatan::where('tgl_beli', '<=', $date)->sum('harga_perolehan');

        $totalAset = $totalAsetLancar + $peralatan;

        // 2. KEWAJIBAN (HUTANG)
        $totalHutang = Hutang::where(DB::raw('DATE(created_at)'), '<=', $date)->sum('nominal');
        $totalPembayaranHutang = PembayaranHutang::where('tanggal', '<=', $date)->sum('nominal_bayar');
        $hutang = (float) ($totalHutang - $totalPembayaranHutang);

        // 3. EKUITAS (MODAL)
        $modal = (float) Modal::where(DB::raw('DATE(created_at)'), '<=', $date)->sum('nominal');

        // Laba Ditahan (Kumulatif Laba Bersih sejak awal s.d $date)
        $pendapatanKumulatif = Penjualan::where(DB::raw('DATE(created_at)'), '<=', $date)->sum('total');
        $hppKumulatif = DB::table('detail_penjualans')
            ->join('penjualans', 'detail_penjualans.penjualan_id', '=', 'penjualans.id')
            ->join('produks', 'detail_penjualans.produk_id', '=', 'produks.id')
            ->where(DB::raw('DATE(penjualans.created_at)'), '<=', $date)
            ->sum(DB::raw('detail_penjualans.qty * produks.hpp'));
        $operasionalKumulatif = PengeluaranOperasional::where('tanggal', '<=', $date)->sum('nominal');
        
        $labaDitahan = (float) ($pendapatanKumulatif - $hppKumulatif - $operasionalKumulatif);

        $totalEkuitas = $modal + $labaDitahan;
        $totalKewajibanDanEkuitas = $hutang + $totalEkuitas;

        return Inertia::render('Reports/BalanceSheet', [
            'date' => $date,
            'assets' => [
                'kas' => $kas,
                'piutang' => $piutang,
                'persediaanBahan' => $persediaanBahan,
                'persediaanProduk' => $persediaanProduk,
                'totalAsetLancar' => $totalAsetLancar,
                'peralatan' => $peralatan,
                'totalAset' => $totalAset,
            ],
            'liabilities' => [
                'hutang' => $hutang,
            ],
            'equity' => [
                'modal' => $modal,
                'labaDitahan' => $labaDitahan,
                'totalEkuitas' => $totalEkuitas,
            ],
            'totalKewajibanDanEkuitas' => $totalKewajibanDanEkuitas,
            'isBalanced' => abs($totalAset - $totalKewajibanDanEkuitas) < 0.01,
        ]);
    }
}
