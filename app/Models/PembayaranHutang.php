<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PembayaranHutang extends Model
{
    protected $table = 'pembayaran_hutangs';

    protected $guarded = [];

    public function hutang(): BelongsTo
    {
        return $this->belongsTo(Hutang::class);
    }

    protected static function booted(): void
    {
        static::creating(function (PembayaranHutang $pembayaran) : void {
            if (! isset($pembayaran->nominal_bayar) || $pembayaran->nominal_bayar <= 0) {
                throw ValidationException::withMessages(['nominal_bayar' => 'Nominal bayar harus lebih besar dari 0']);
            }

            $hutang = $pembayaran->hutang;
            if ($hutang) {
                $totalBayar = $hutang->pembayaranHutangs()->sum('nominal_bayar');
                if (($totalBayar + $pembayaran->nominal_bayar) > $hutang->nominal) {
                    throw ValidationException::withMessages(['nominal_bayar' => 'Pembayaran melebihi sisa hutang']);
                }
            }
        });

        static::created(function (PembayaranHutang $pembayaran) : void {
            $hutang = $pembayaran->hutang;
            if (! $hutang) {
                return;
            }

            $totalBayar = $hutang->pembayaranHutangs()->sum('nominal_bayar');
            if ($totalBayar >= $hutang->nominal) {
                $hutang->status = 'lunas';
                $hutang->save();
            }
        });
    }
}
