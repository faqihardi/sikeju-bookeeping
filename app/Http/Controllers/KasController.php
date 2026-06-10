<?php

namespace App\Http\Controllers;

use App\Http\Requests\Kas\StoreKasRequest;
use App\Models\Kas;
use Inertia\Inertia;

class KasController extends Controller
{
    public function index()
    {
        $transactions = Kas::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalMasuk = Kas::sum('masuk');
        $totalKeluar = Kas::sum('keluar');
        $saldoSaatIni = $totalMasuk - $totalKeluar;

        return Inertia::render('Kas/Index', [
            'transactions' => $transactions,
            'metrics' => [
                'totalMasuk' => $totalMasuk,
                'totalKeluar' => $totalKeluar,
                'saldoSaatIni' => $saldoSaatIni,
            ]
        ]);
    }

    public function store(StoreKasRequest $request)
    {
        $data = $request->validated();
        
        $masuk = $data['tipe_penyesuaian'] === 'masuk' ? $data['nominal'] : 0;
        $keluar = $data['tipe_penyesuaian'] === 'keluar' ? $data['nominal'] : 0;

        Kas::create([
            'tanggal' => $data['tanggal'],
            'keterangan' => $data['keterangan'],
            'masuk' => $masuk,
            'keluar' => $keluar,
            'sumber' => 'lainnya',
            'kasable_id' => null,
            'kasable_type' => null,
        ]);

        return redirect()->route('cash.index')->with('success', 'Penyesuaian kas berhasil dicatat.');
    }

    public function destroy(Kas $cash)
    {
        // Only allow deleting manual adjustments (sumber = 'lainnya')
        if ($cash->sumber !== 'lainnya') {
            return redirect()->route('cash.index')->with('error', 'Transaksi otomatis tidak dapat dihapus secara langsung. Hapus dari sumber transaksinya.');
        }

        $cash->delete();
        return redirect()->route('cash.index')->with('success', 'Penyesuaian kas berhasil dihapus.');
    }
}
