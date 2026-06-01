<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePembayaranHutangRequest;
use App\Models\PembayaranHutang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PembayaranHutangController extends Controller
{
    public function store(StorePembayaranHutangRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            PembayaranHutang::create($request->validated());
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pembayaran hutang berhasil disimpan.',
        ]);

        return back();
    }
}
