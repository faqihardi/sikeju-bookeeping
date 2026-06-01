<?php

use App\Models\Hutang;
use App\Models\MetodePembayaran;
use App\Models\PembayaranHutang;
use App\Models\PembayaranPiutang;
use App\Models\Pelanggan;
use App\Models\Peralatan;
use App\Models\Piutang;
use App\Models\Penjualan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('stores hutang payment through the http endpoint', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $peralatan = Peralatan::create([
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

    $this->actingAs($user)
        ->from('/dashboard')
        ->post(route('pembayaran-hutang.store'), [
            'hutang_id' => $hutang->id,
            'nominal_bayar' => 1000,
            'tanggal' => now()->toDateString(),
        ])
        ->assertRedirect('/dashboard');

    expect(PembayaranHutang::count())->toBe(1);
    expect($hutang->fresh()->status)->toBe('lunas');
});

it('stores piutang payment through the http endpoint', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $pelanggan = Pelanggan::create(['nama_pelanggan' => 'Test Pelanggan', 'no_telepon' => null]);
    $metode = MetodePembayaran::create(['nama_metode' => 'utang']);
    $penjualan = Penjualan::create([
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

    $this->actingAs($user)
        ->from('/dashboard')
        ->post(route('pembayaran-piutang.store'), [
            'piutang_id' => $piutang->id,
            'nominal_bayar' => 2000,
            'tanggal' => now()->toDateString(),
        ])
        ->assertRedirect('/dashboard');

    expect(PembayaranPiutang::count())->toBe(1);
    expect($piutang->fresh()->status)->toBe('lunas');
});

it('rejects overpaying hutang through the http endpoint', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $peralatan = Peralatan::create([
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

    $this->actingAs($user)
        ->from('/dashboard')
        ->post(route('pembayaran-hutang.store'), [
            'hutang_id' => $hutang->id,
            'nominal_bayar' => 2000,
            'tanggal' => now()->toDateString(),
        ])
        ->assertSessionHasErrors('nominal_bayar');
});
