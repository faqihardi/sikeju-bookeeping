<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Hutang;
use App\Models\PembayaranHutang;

uses(RefreshDatabase::class);

it('marks hutang as belum lunas after partial payment', function () {
    $peralatan = \App\Models\Peralatan::create([
        'nama_alat' => 'Test Alat',
        'harga_perolehan' => 5000,
        'tgl_beli' => now()->toDateString(),
        'umur_ekonomis' => 5,
        'status_alat' => 'layak_pakai',
    ]);

    $hutang = Hutang::create([
        'pembelian_id' => null,
        'peralatan_id' => $peralatan->id,
        'keterangan' => 'Test hutang',
        'nominal' => 1000,
        'status' => 'belum_lunas',
        'tgl_jatuh_tempo' => now()->toDateString(),
    ]);

    PembayaranHutang::create([
        'hutang_id' => $hutang->id,
        'nominal_bayar' => 200,
        'tanggal' => now()->toDateString(),
    ]);

    $hutang->refresh();

    expect($hutang->status)->toBe('belum_lunas');
});

it('marks hutang as lunas after full payment', function () {
    $peralatan = \App\Models\Peralatan::create([
        'nama_alat' => 'Test Alat',
        'harga_perolehan' => 5000,
        'tgl_beli' => now()->toDateString(),
        'umur_ekonomis' => 5,
        'status_alat' => 'layak_pakai',
    ]);

    $hutang = Hutang::create([
        'pembelian_id' => null,
        'peralatan_id' => $peralatan->id,
        'keterangan' => 'Test hutang',
        'nominal' => 1000,
        'status' => 'belum_lunas',
        'tgl_jatuh_tempo' => now()->toDateString(),
    ]);

    PembayaranHutang::create([
        'hutang_id' => $hutang->id,
        'nominal_bayar' => 1000,
        'tanggal' => now()->toDateString(),
    ]);

    $hutang->refresh();

    expect($hutang->status)->toBe('lunas');
});

it('prevents overpaying a hutang', function () {
    $this->expectException(\Illuminate\Validation\ValidationException::class);

    $peralatan = \App\Models\Peralatan::create([
        'nama_alat' => 'Test Alat',
        'harga_perolehan' => 5000,
        'tgl_beli' => now()->toDateString(),
        'umur_ekonomis' => 5,
        'status_alat' => 'layak_pakai',
    ]);

    $hutang = Hutang::create([
        'pembelian_id' => null,
        'peralatan_id' => $peralatan->id,
        'keterangan' => 'Test hutang',
        'nominal' => 1000,
        'status' => 'belum_lunas',
        'tgl_jatuh_tempo' => now()->toDateString(),
    ]);

    PembayaranHutang::create([
        'hutang_id' => $hutang->id,
        'nominal_bayar' => 1200,
        'tanggal' => now()->toDateString(),
    ]);
});
