<?php

namespace App\Http\Controllers;

use App\Models\Piutang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PiutangController extends Controller
{
    public function index()
    {
        $receivables = Piutang::with(['penjualan.pelanggan', 'pembayaranPiutangs'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Receivables/Index', [
            'receivables' => $receivables
        ]);
    }

    public function bayarCicilan(Request $request, Piutang $piutang)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'nominal_bayar' => 'required|numeric|min:1',
        ]);

        DB::transaction(function () use ($validated, $piutang) {
            // 1. Simpan history cicilan piutang
            $pembayaran = $piutang->pembayaranPiutangs()->create([
                'tanggal' => $validated['tanggal'],
                'nominal_bayar' => $validated['nominal_bayar'],
            ]);

            // 2. Tambah kas masuk
            $pembayaran->kas()->create([
                'tanggal' => $validated['tanggal'],
                'keterangan' => 'Penerimaan Cicilan Piutang dari Penjualan: ' . $piutang->penjualan->no_faktur,
                'masuk' => $validated['nominal_bayar'],
                'keluar' => 0,
                'sumber' => 'piutang'
            ]);

            // 3. Update status jika lunas
            $totalDibayar = $piutang->pembayaranPiutangs()->sum('nominal_bayar');

            if ($totalDibayar >= $piutang->nominal) {
                $piutang->update(['status' => 'lunas']);
            }
        });

        return back()->with('success', 'Pembayaran cicilan piutang berhasil diterima.');
    }
}
