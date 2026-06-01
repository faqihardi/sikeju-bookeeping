<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePembayaranPiutangRequest;
use App\Models\PembayaranPiutang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PembayaranPiutangController extends Controller
{
    public function store(StorePembayaranPiutangRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            PembayaranPiutang::create($request->validated());
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pembayaran piutang berhasil disimpan.',
        ]);

        return back();
    }
}
