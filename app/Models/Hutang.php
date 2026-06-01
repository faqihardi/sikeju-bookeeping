<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Validation\ValidationException;

class Hutang extends Model
{
    protected $table = 'hutangs';

    protected $guarded = [];

    protected static function booted(): void
    {
        static::saving(function (Hutang $hutang): void {
            $pembelianTerisi = filled($hutang->pembelian_id);
            $peralatanTerisi = filled($hutang->peralatan_id);

            if ($pembelianTerisi === $peralatanTerisi) {
                throw ValidationException::withMessages([
                    'pembelian_id' => 'Pilih tepat satu sumber hutang: pembelian atau peralatan.',
                    'peralatan_id' => 'Pilih tepat satu sumber hutang: pembelian atau peralatan.',
                ]);
            }
        });
    }

    public function pembelian(): BelongsTo
    {
        return $this->belongsTo(Pembelian::class, 'pembelian_id');
    }

    public function peralatan(): BelongsTo
    {
        return $this->belongsTo(Peralatan::class, 'peralatan_id');
    }

    public function pembayaranHutangs(): HasMany
    {
        return $this->hasMany(PembayaranHutang::class);
    }
}
