<?php

namespace App\Http\Controllers;

use App\Models\Pembelian;
use App\Models\BahanBaku;
use App\Models\Pemasok;
use App\Models\MetodePembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PembelianController extends Controller
{
    public function index()
    {
        $purchases = Pembelian::with(['pemasok', 'detailPembelians.bahanBaku', 'hutang'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases
        ]);
    }

    public function create()
    {
        return Inertia::render('Purchases/Create', [
            'pemasoks' => Pemasok::orderBy('nama_pemasok')->get(),
            'bahanBakus' => BahanBaku::orderBy('nama_bahan')->get(),
            'metodePembayarans' => MetodePembayaran::orderBy('nama_metode')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pemasok_id' => 'required|exists:pemasoks,id',
            'metode_pembayaran_id' => 'required|exists:metode_pembayarans,id',
            'nama_pembelian' => 'required|string|max:255',
            'jenis_pembayaran' => 'required|in:Tunai,Kredit',
            'tgl_jatuh_tempo' => 'required_if:jenis_pembayaran,Kredit|nullable|date',
            'items' => 'required|array|min:1',
            'items.*.bahan_baku_id' => 'required|exists:bahan_bakus,id',
            'items.*.qty' => 'required|numeric|min:1',
            'items.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $totalPembelian = collect($validated['items'])->sum(function ($item) {
                return $item['qty'] * $item['harga_satuan'];
            });

            // 1. Simpan Header Pembelian
            $pembelian = Pembelian::create([
                'pemasok_id' => $validated['pemasok_id'],
                'metode_pembayaran_id' => $validated['metode_pembayaran_id'],
                'nama_pembelian' => $validated['nama_pembelian'],
                'total' => $totalPembelian,
            ]);

            // 2. Looping Items (Detail Pembelian & Stok)
            foreach ($validated['items'] as $item) {
                $bahanBaku = BahanBaku::findOrFail($item['bahan_baku_id']);

                $pembelian->detailPembelians()->create([
                    'bahan_baku_id' => $item['bahan_baku_id'],
                    'qty' => $item['qty'],
                    'harga_satuan' => $item['harga_satuan'],
                    'subtotal' => $item['qty'] * $item['harga_satuan'],
                    'satuan' => $bahanBaku->satuan,
                ]);

                $bahanBaku->increment('stok', $item['qty']);
            }

            // 3. Evaluasi Jenis Pembayaran
            if ($validated['jenis_pembayaran'] === 'Tunai') {
                $pembelian->kas()->create(['masuk' => 0, 'keluar' => $totalPembelian, 'sumber' => 'pembelian']);
            } else {
                $pembelian->hutang()->create([
                    'nominal' => $totalPembelian,
                    'status' => 'belum_lunas',
                    'tgl_jatuh_tempo' => $validated['tgl_jatuh_tempo'],
                ]);
            }
        });

        return redirect()->route('purchases.index')->with('success', 'Transaksi Pembelian Berhasil Dicatat.');
    }
}