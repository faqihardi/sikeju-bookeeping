<?php

namespace App\Http\Controllers;

use App\Models\Hutang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HutangController extends Controller
{
    public function index()
    {
        $payables = Hutang::with(['pembelian.pemasok', 'pembayaranHutangs'])->orderBy('created_at', 'desc')->get();
        return Inertia::render('Payables/Index', [
            'payables' => $payables
        ]);
    }

    public function bayarCicilan(Request $request, Hutang $hutang)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'nominal_bayar' => 'required|numeric|min:1',
        ]);

        DB::transaction(function () use ($validated, $hutang) {
            // 1. Simpan history cicilan
            $pembayaran = $hutang->pembayaranHutangs()->create([
                'tanggal' => $validated['tanggal'],
                'nominal_bayar' => $validated['nominal_bayar'],
            ]);

            // 2. Potong Uang Kas
            $pembayaran->kas()->create([
                'tanggal' => $validated['tanggal'],
                'keterangan' => 'Pembayaran Cicilan Hutang',
                'masuk' => 0, 
                'keluar' => $validated['nominal_bayar'], 
                'sumber' => 'hutang'
            ]);

            // 3. Update status jika lunas
            $totalDibayar = $hutang->pembayaranHutangs()->sum('nominal_bayar');
            
            if ($totalDibayar >= $hutang->nominal) {
                $hutang->update(['status' => 'lunas']);
            }
        });

        return back()->with('success', 'Pembayaran cicilan hutang berhasil.');
    }
}