<?php

namespace App\Http\Controllers;

use App\Models\Penjualan;
use App\Models\Pelanggan;
use App\Models\Produk;
use App\Models\MetodePembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PenjualanController extends Controller
{
    public function index()
    {
        $sales = Penjualan::with(['pelanggan', 'detailPenjualans.produk', 'piutang'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Sales/Index', [
            'sales' => $sales
        ]);
    }

    public function create()
    {
        return Inertia::render('Sales/Create', [
            'customers' => Pelanggan::orderBy('kode', 'asc')->get(),
            'products' => Produk::orderBy('kode', 'asc')->get(),
            'paymentMethods' => MetodePembayaran::orderBy('nama_metode')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pelanggan_id' => 'required|exists:pelanggans,id',
            'metode_pembayaran_id' => 'required|exists:metode_pembayarans,id',
            'no_faktur' => 'nullable|string|max:255',
            'jenis_pembayaran' => 'required|in:Tunai,Kredit',
            'tgl_jatuh_tempo' => 'required_if:jenis_pembayaran,Kredit|nullable|date',
            'items' => 'required|array|min:1',
            'items.*.produk_id' => 'required|exists:produks,id',
            'items.*.qty' => 'required|numeric|min:1',
            'items.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        // --- VALIDASI STOK PRODUK JADI SEBELUM TRANSAKSI ---
        $errors = [];
        foreach ($validated['items'] as $item) {
            $produk = Produk::findOrFail($item['produk_id']);
            if ($item['qty'] > $produk->stok) {
                $errors[] = "Stok produk \"{$produk->nama_produk}\" tidak mencukupi. "
                    . "Dibutuhkan: {$item['qty']}, "
                    . "Sisa stok: {$produk->stok}.";
            }
        }
        if (!empty($errors)) {
            return back()->withErrors(['items' => $errors])->withInput();
        }
        // ---------------------------------------------------

        DB::transaction(function () use ($validated) {
            $totalSales = collect($validated['items'])->sum(function ($item) {
                return $item['qty'] * $item['harga_satuan'];
            });

            // Auto-generate invoice number if empty
            $noFaktur = $validated['no_faktur'];
            if (empty($noFaktur)) {
                $last = Penjualan::orderBy('id', 'desc')->first();
                $nextId = $last ? $last->id + 1 : 1;
                $noFaktur = 'INV-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
            }

            // 1. Simpan Header Penjualan
            $penjualan = Penjualan::create([
                'pelanggan_id' => $validated['pelanggan_id'],
                'metode_pembayaran_id' => $validated['metode_pembayaran_id'],
                'no_faktur' => $noFaktur,
                'total' => $totalSales,
            ]);

            // 2. Looping Items (Detail Penjualan & Stok)
            foreach ($validated['items'] as $item) {
                $produk = Produk::findOrFail($item['produk_id']);

                $penjualan->detailPenjualans()->create([
                    'produk_id' => $item['produk_id'],
                    'qty' => $item['qty'],
                    'harga_satuan' => $item['harga_satuan'],
                    'subtotal' => $item['qty'] * $item['harga_satuan'],
                ]);

                // Kurangi stok produk jadi
                $produk->decrement('stok', $item['qty']);
            }

            // 3. Evaluasi Jenis Pembayaran
            if ($validated['jenis_pembayaran'] === 'Tunai') {
                $penjualan->kas()->create([
                    'tanggal' => now()->toDateString(),
                    'keterangan' => 'Penjualan Tunai: ' . $noFaktur,
                    'masuk' => $totalSales,
                    'keluar' => 0,
                    'sumber' => 'penjualan'
                ]);
            } else {
                $penjualan->piutang()->create([
                    'nominal' => $totalSales,
                    'status' => 'belum_lunas',
                    'tgl_jatuh_tempo' => $validated['tgl_jatuh_tempo'],
                ]);
            }
        });

        return redirect()->route('sales.index')->with('success', 'Transaksi Penjualan Berhasil Dicatat.');
    }

    public function destroy(Penjualan $sale)
    {
        DB::transaction(function () use ($sale) {
            // Revert stok produk jadi
            foreach ($sale->detailPenjualans as $detail) {
                $detail->produk->increment('stok', $detail->qty);
            }

            // Delete Penjualan (Eloquent booted deleted event will delete Kas record; cascade deletes take care of details & piutang)
            $sale->delete();
        });

        return redirect()->route('sales.index')->with('success', 'Transaksi Penjualan berhasil dihapus dan stok telah dikembalikan.');
    }
}
