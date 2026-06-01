<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\ValidationException;

class PembayaranPiutang extends Model
{
    protected $table = 'pembayaran_piutangs';

    protected $guarded = [];

    public function piutang(): BelongsTo
    {
        return $this->belongsTo(Piutang::class);
    }

    protected static function booted(): void
    {
        static::creating(function (PembayaranPiutang $pembayaran) : void {
            if (! isset($pembayaran->nominal_bayar) || $pembayaran->nominal_bayar <= 0) {
                throw ValidationException::withMessages(['nominal_bayar' => 'Nominal bayar harus lebih besar dari 0']);
            }

            $piutang = $pembayaran->piutang;
            if ($piutang) {
                $totalTerima = $piutang->pembayaranPiutangs()->sum('nominal_bayar');
                if (($totalTerima + $pembayaran->nominal_bayar) > $piutang->nominal) {
                    throw ValidationException::withMessages(['nominal_bayar' => 'Pembayaran melebihi sisa piutang']);
                }
            }
        });

        static::created(function (PembayaranPiutang $pembayaran) : void {
            $piutang = $pembayaran->piutang;
            if (! $piutang) {
                return;
            }

            $totalTerima = $piutang->pembayaranPiutangs()->sum('nominal_bayar');
            if ($totalTerima >= $piutang->nominal) {
                $piutang->status = 'lunas';
                $piutang->save();
            }
        });
    }
}
