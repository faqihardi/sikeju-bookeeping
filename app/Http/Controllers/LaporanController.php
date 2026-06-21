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
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
    private function getAkumulasiPenyusutan($date)
    {
        $peralatans = Peralatan::where('tgl_beli', '<=', $date)->get();
        $totalDepreciation = 0;

        foreach ($peralatans as $alat) {
            if ($alat->persentase_penyusutan > 0) {
                $tglBeli = Carbon::parse($alat->tgl_beli);
                $targetDate = Carbon::parse($date);
                $months = $tglBeli->diffInMonths($targetDate);
                
                if ($months > 0) {
                    // Capping at 100% depreciation
                    $maxMonths = floor(100 / $alat->persentase_penyusutan);
                    if ($months > $maxMonths) {
                        $months = $maxMonths;
                    }
                    
                    $depreciation = $alat->harga_perolehan * ($alat->persentase_penyusutan / 100) * $months;
                    $totalDepreciation += $depreciation;
                }
            }
        }
        return $totalDepreciation;
    }

    private function getCashFlowData(Request $request)
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

        return [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'saldoAwal' => $saldoAwal,
            'inflows' => $formattedInflows,
            'outflows' => $formattedOutflows,
            'totalInflow' => $totalInflow,
            'totalOutflow' => $totalOutflow,
            'saldoAkhir' => $saldoAkhir,
        ];
    }

    public function cashFlow(Request $request)
    {
        return Inertia::render('Reports/CashFlow', $this->getCashFlowData($request));
    }

    public function cashFlowPdf(Request $request)
    {
        $data = $this->getCashFlowData($request);
        $pdf = Pdf::loadView('pdf.cash-flow', $data);
        return $pdf->download('Laporan_Arus_Kas_' . $data['startDate'] . '_to_' . $data['endDate'] . '.pdf');
    }

    private function getIncomeStatementData(Request $request)
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

        // 4. Beban Operasional (Termasuk Rugi/Laba dari Koreksi Stok)
        $operasionalKas = (float) PengeluaranOperasional::whereBetween('tanggal', [$startDate, $endDate])->sum('nominal');

        $koreksiStokLoss = (float) DB::table('koreksi_stoks')
            ->join('produks', 'koreksi_stoks.produk_id', '=', 'produks.id')
            ->where('koreksi_stoks.jenis_koreksi', 'keluar')
            ->whereBetween(DB::raw('DATE(koreksi_stoks.created_at)'), [$startDate, $endDate])
            ->sum(DB::raw('koreksi_stoks.qty * produks.hpp'));

        $koreksiStokGain = (float) DB::table('koreksi_stoks')
            ->join('produks', 'koreksi_stoks.produk_id', '=', 'produks.id')
            ->where('koreksi_stoks.jenis_koreksi', 'masuk')
            ->whereBetween(DB::raw('DATE(koreksi_stoks.created_at)'), [$startDate, $endDate])
            ->sum(DB::raw('koreksi_stoks.qty * produks.hpp'));

        $bebanPenyusutan = $this->getAkumulasiPenyusutan($endDate) - $this->getAkumulasiPenyusutan($startDate);

        $operasional = $operasionalKas + $koreksiStokLoss - $koreksiStokGain + $bebanPenyusutan;

        // 5. Laba Bersih Sebelum Pajak
        $labaBersihSebelumPajak = $labaKotor - $operasional;

        // 6. Beban Pajak PPh Final (0.5% dari Omzet/Pendapatan)
        $bebanPajak = $pendapatan * 0.005;

        // 7. Laba Bersih Setelah Pajak
        $labaBersihSetelahPajak = $labaBersihSebelumPajak - $bebanPajak;

        return [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'pendapatan' => $pendapatan,
            'hpp' => $hpp,
            'labaKotor' => $labaKotor,
            'operasional' => $operasional,
            'operasionalDetail' => [
                'kas' => $operasionalKas,
                'koreksiStokLoss' => $koreksiStokLoss,
                'koreksiStokGain' => $koreksiStokGain,
                'penyusutan' => $bebanPenyusutan,
            ],
            'labaBersihSebelumPajak' => $labaBersihSebelumPajak,
            'bebanPajak' => $bebanPajak,
            'labaBersih' => $labaBersihSetelahPajak,
        ];
    }

    public function incomeStatement(Request $request)
    {
        return Inertia::render('Reports/IncomeStatement', $this->getIncomeStatementData($request));
    }

    public function incomeStatementPdf(Request $request)
    {
        $data = $this->getIncomeStatementData($request);
        $pdf = Pdf::loadView('pdf.income-statement', $data);
        return $pdf->download('Laporan_Laba_Rugi_' . $data['startDate'] . '_to_' . $data['endDate'] . '.pdf');
    }

    private function getBalanceSheetData(Request $request)
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
        $peralatanAwal = (float) Peralatan::where('tgl_beli', '<=', $date)->sum('harga_perolehan');
        $akumulasiPenyusutan = $this->getAkumulasiPenyusutan($date);
        $peralatan = $peralatanAwal - $akumulasiPenyusutan;

        $totalAset = $totalAsetLancar + $peralatan;

        // 2. KEWAJIBAN (HUTANG)
        $totalHutang = Hutang::where(DB::raw('DATE(created_at)'), '<=', $date)->sum('nominal');
        $totalPembayaranHutang = PembayaranHutang::where('tanggal', '<=', $date)->sum('nominal_bayar');
        $hutangDagang = (float) ($totalHutang - $totalPembayaranHutang);

        // Hitung Hutang Pajak
        $pendapatanPajak = Penjualan::where(DB::raw('DATE(created_at)'), '<=', $date)->sum('total');
        $kewajibanPajakKumulatif = $pendapatanPajak * 0.005;
        
        $pajakTerbayar = PengeluaranOperasional::where('tanggal', '<=', $date)
            ->where(function ($query) {
                $query->where('kategori', 'Pajak')
                    ->orWhere('keterangan', 'LIKE', '%pajak%');
            })->sum('nominal');

        $hutangPajak = (float) ($kewajibanPajakKumulatif - $pajakTerbayar);
        if ($hutangPajak < 0) $hutangPajak = 0; // Jika bayar lebih, dianggap 0 untuk hutang

        $hutang = $hutangDagang + $hutangPajak;

        // 3. EKUITAS (MODAL)
        $modalKas = (float) Modal::where(DB::raw('DATE(created_at)'), '<=', $date)->sum('nominal');
        // Asumsi: Karena Peralatan tidak memotong Kas/Hutang di sistem, maka Peralatan diakui sebagai Modal Bawaan Fisik (Nilai Awal).
        $modal = $modalKas + $peralatanAwal;

        // Laba Ditahan (Kumulatif Laba Bersih sejak awal s.d $date)
        $pendapatanKumulatif = Penjualan::where(DB::raw('DATE(created_at)'), '<=', $date)->sum('total');
        $hppKumulatif = DB::table('detail_penjualans')
            ->join('penjualans', 'detail_penjualans.penjualan_id', '=', 'penjualans.id')
            ->join('produks', 'detail_penjualans.produk_id', '=', 'produks.id')
            ->where(DB::raw('DATE(penjualans.created_at)'), '<=', $date)
            ->sum(DB::raw('detail_penjualans.qty * produks.hpp'));
        
        $operasionalKasKumulatif = PengeluaranOperasional::where('tanggal', '<=', $date)->sum('nominal');

        $koreksiStokLossKumulatif = (float) DB::table('koreksi_stoks')
            ->join('produks', 'koreksi_stoks.produk_id', '=', 'produks.id')
            ->where('koreksi_stoks.jenis_koreksi', 'keluar')
            ->where(DB::raw('DATE(koreksi_stoks.created_at)'), '<=', $date)
            ->sum(DB::raw('koreksi_stoks.qty * produks.hpp'));

        $koreksiStokGainKumulatif = (float) DB::table('koreksi_stoks')
            ->join('produks', 'koreksi_stoks.produk_id', '=', 'produks.id')
            ->where('koreksi_stoks.jenis_koreksi', 'masuk')
            ->where(DB::raw('DATE(koreksi_stoks.created_at)'), '<=', $date)
            ->sum(DB::raw('koreksi_stoks.qty * produks.hpp'));

        $operasionalKumulatif = $operasionalKasKumulatif + $koreksiStokLossKumulatif - $koreksiStokGainKumulatif + $akumulasiPenyusutan;
        
        $labaDitahan = (float) ($pendapatanKumulatif - $hppKumulatif - $operasionalKumulatif - $hutangPajak);

        $totalEkuitas = $modal + $labaDitahan;
        $totalKewajibanDanEkuitas = $hutang + $totalEkuitas;

        return [
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
                'hutang' => $hutangDagang,
                'hutangPajak' => $hutangPajak,
                'totalHutang' => $hutang,
            ],
            'equity' => [
                'modal' => $modal,
                'labaDitahan' => $labaDitahan,
                'totalEkuitas' => $totalEkuitas,
            ],
            'totalKewajibanDanEkuitas' => $totalKewajibanDanEkuitas,
            'isBalanced' => abs($totalAset - $totalKewajibanDanEkuitas) < 0.01,
        ];
    }

    public function balanceSheet(Request $request)
    {
        return Inertia::render('Reports/BalanceSheet', $this->getBalanceSheetData($request));
    }

    public function balanceSheetPdf(Request $request)
    {
        $data = $this->getBalanceSheetData($request);
        $pdf = Pdf::loadView('pdf.balance-sheet', $data);
        return $pdf->download('Laporan_Posisi_Keuangan_' . $data['date'] . '.pdf');
    }

    private function getTaxReportData(Request $request)
    {
        $selectedYear = $request->input('year', Carbon::now()->year);

        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $yearSelect = $isSqlite ? "strftime('%Y', created_at)" : "YEAR(created_at)";
        $monthSelect = $isSqlite ? "cast(strftime('%m', created_at) as integer)" : "MONTH(created_at)";
        $monthSelectTanggal = $isSqlite ? "cast(strftime('%m', tanggal) as integer)" : "MONTH(tanggal)";

        // Get available tax years dynamically from sales
        $years = Penjualan::selectRaw("$yearSelect as year")
            ->groupBy('year')
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        if (empty($years)) {
            $years = [(int) Carbon::now()->year];
        } else {
            $years = array_map('intval', $years);
        }

        // Ensure selected year is in years list
        if (!in_array((int)$selectedYear, $years)) {
            $years[] = (int)$selectedYear;
            sort($years);
            $years = array_reverse($years);
        }

        // Monthly sales aggregation for selected year
        $monthlySales = Penjualan::selectRaw("$monthSelect as month, SUM(total) as omzet")
            ->whereYear('created_at', $selectedYear)
            ->groupBy(DB::raw($monthSelect))
            ->pluck('omzet', 'month')
            ->toArray();

        // Monthly paid tax aggregation from pengeluaran_operasionals (kategori = 'Pajak' or keterangan contains 'pajak')
        $paidTaxes = PengeluaranOperasional::whereYear('tanggal', $selectedYear)
            ->where(function ($query) {
                $query->where('kategori', 'Pajak')
                    ->orWhere('keterangan', 'LIKE', '%pajak%');
            })
            ->selectRaw("$monthSelectTanggal as month, SUM(nominal) as total")
            ->groupBy(DB::raw($monthSelectTanggal))
            ->pluck('total', 'month')
            ->toArray();

        $months = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        $yearlyTotalOmzet = 0;
        $yearlyTotalTax = 0;
        $yearlyTotalPaidTax = 0;
        $monthlyData = [];

        foreach ($months as $num => $name) {
            $omzet = (float) ($monthlySales[$num] ?? 0);
            $tax = $omzet * 0.005; // PPh Final 0.5%
            $paid = (float) ($paidTaxes[$num] ?? 0);

            $yearlyTotalOmzet += $omzet;
            $yearlyTotalTax += $tax;
            $yearlyTotalPaidTax += $paid;

            // Due date: 15th of the following month
            $nextMonthNum = $num === 12 ? 1 : $num + 1;
            $nextMonthYear = $num === 12 ? $selectedYear + 1 : $selectedYear;
            $nextMonthName = $months[$nextMonthNum];
            $dueDate = "15 " . $nextMonthName . " " . $nextMonthYear;

            $monthlyData[] = [
                'month_number' => $num,
                'month_name' => $name,
                'omzet' => $omzet,
                'tax' => $tax,
                'paid' => $paid,
                'due_date' => $dueDate,
            ];
        }

        return [
            'selectedYear' => (int) $selectedYear,
            'years' => $years,
            'yearlyTotalOmzet' => $yearlyTotalOmzet,
            'yearlyTotalTax' => $yearlyTotalTax,
            'yearlyTotalPaidTax' => $yearlyTotalPaidTax,
            'monthlyData' => $monthlyData,
        ];
    }

    public function taxReport(Request $request)
    {
        return Inertia::render('Reports/TaxReport', $this->getTaxReportData($request));
    }

    public function taxReportPdf(Request $request)
    {
        $data = $this->getTaxReportData($request);
        $pdf = Pdf::loadView('pdf.tax-report', $data);
        return $pdf->download('Laporan_Pajak_PPh_Final_' . $data['selectedYear'] . '.pdf');
    }
}

