<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Piutang;
use App\Models\PembayaranPiutang;

uses(RefreshDatabase::class);

it('marks piutang as belum lunas after partial payment', function () {
    $pelanggan = \App\Models\Pelanggan::create(['nama_pelanggan' => 'Test Pelanggan', 'no_telepon' => null]);
    $metode = \App\Models\MetodePembayaran::create(['nama_metode' => 'utang']);
    $penjualan = \App\Models\Penjualan::create([
        'pelanggan_id' => $pelanggan->id,
        'metode_pembayaran_id' => $metode->id,
        'no_faktur' => 'F001',
        'total' => 2000,
    ]);

    $piutang = Piutang::create([
        'penjualan_id' => $penjualan->id,
        'nominal' => 2000,
        'status' => 'belum_lunas',
        'tgl_jatuh_tempo' => now()->toDateString(),
    ]);

    PembayaranPiutang::create([
        'piutang_id' => $piutang->id,
        'nominal_bayar' => 500,
        'tanggal' => now()->toDateString(),
    ]);

    $piutang->refresh();

    expect($piutang->status)->toBe('belum_lunas');
});

it('marks piutang as lunas after full payment', function () {
    $pelanggan = \App\Models\Pelanggan::create(['nama_pelanggan' => 'Test Pelanggan', 'no_telepon' => null]);
    $metode = \App\Models\MetodePembayaran::create(['nama_metode' => 'utang']);
    $penjualan = \App\Models\Penjualan::create([
        'pelanggan_id' => $pelanggan->id,
        'metode_pembayaran_id' => $metode->id,
        'no_faktur' => 'F001',
        'total' => 2000,
    ]);

    $piutang = Piutang::create([
        'penjualan_id' => $penjualan->id,
        'nominal' => 2000,
        'status' => 'belum_lunas',
        'tgl_jatuh_tempo' => now()->toDateString(),
    ]);

    PembayaranPiutang::create([
        'piutang_id' => $piutang->id,
        'nominal_bayar' => 2000,
        'tanggal' => now()->toDateString(),
    ]);

    $piutang->refresh();

    expect($piutang->status)->toBe('lunas');
});

it('prevents overpaying a piutang', function () {
    $this->expectException(\Illuminate\Validation\ValidationException::class);
    $pelanggan = \App\Models\Pelanggan::create(['nama_pelanggan' => 'Test Pelanggan', 'no_telepon' => null]);
    $metode = \App\Models\MetodePembayaran::create(['nama_metode' => 'utang']);
    $penjualan = \App\Models\Penjualan::create([
        'pelanggan_id' => $pelanggan->id,
        'metode_pembayaran_id' => $metode->id,
        'no_faktur' => 'F001',
        'total' => 2000,
    ]);

    $piutang = Piutang::create([
        'penjualan_id' => $penjualan->id,
        'nominal' => 2000,
        'status' => 'belum_lunas',
        'tgl_jatuh_tempo' => now()->toDateString(),
    ]);

    PembayaranPiutang::create([
        'piutang_id' => $piutang->id,
        'nominal_bayar' => 3000,
        'tanggal' => now()->toDateString(),
    ]);
});
