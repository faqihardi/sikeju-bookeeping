<?php

namespace App\Http\Controllers;

use App\Http\Requests\PengeluaranOperasional\StorePengeluaranOperasionalRequest;
use App\Http\Requests\PengeluaranOperasional\UpdatePengeluaranOperasionalRequest;
use App\Models\PengeluaranOperasional;
use Carbon\Carbon;
use Inertia\Inertia;

class PengeluaranOperasionalController extends Controller
{
    public function index()
    {
        $expenses = PengeluaranOperasional::orderBy('tanggal', 'desc')->get();

        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $totalBulanIni = PengeluaranOperasional::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('nominal');

        $pengeluaranTerbesarRecord = PengeluaranOperasional::orderBy('nominal', 'desc')->first();
        $pengeluaranTerbesar = [
            'kategori' => $pengeluaranTerbesarRecord ? $pengeluaranTerbesarRecord->kategori : '-',
            'nominal' => $pengeluaranTerbesarRecord ? $pengeluaranTerbesarRecord->nominal : 0,
        ];

        $jumlahTransaksi = PengeluaranOperasional::count();

        return Inertia::render('PengeluaranOperasional/Index', [
            'expenses' => $expenses,
            'metrics' => [
                'totalBulanIni' => $totalBulanIni,
                'pengeluaranTerbesar' => $pengeluaranTerbesar,
                'jumlahTransaksi' => $jumlahTransaksi,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('PengeluaranOperasional/Create');
    }

    public function store(StorePengeluaranOperasionalRequest $request)
    {
        $data = $request->validated();
        PengeluaranOperasional::create($data);

        return redirect()->route('operational-expenses.index')->with('success', 'Biaya operasional berhasil dicatat.');
    }

    public function edit(PengeluaranOperasional $operationalExpense)
    {
        return Inertia::render('PengeluaranOperasional/Create', [
            'expense' => $operationalExpense
        ]);
    }

    public function update(StorePengeluaranOperasionalRequest $request, PengeluaranOperasional $operationalExpense)
    {
        $data = $request->validated();
        $operationalExpense->update($data);

        return redirect()->route('operational-expenses.index')->with('success', 'Biaya operasional berhasil diperbarui.');
    }

    public function destroy(PengeluaranOperasional $operationalExpense)
    {
        $operationalExpense->delete();
        return redirect()->route('operational-expenses.index')->with('success', 'Biaya operasional berhasil dihapus.');
    }
}
