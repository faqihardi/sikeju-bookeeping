<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengeluaranOperasional extends Model
{
    protected $table = 'pengeluaran_operasionals';

    protected $guarded = [];

    public function kas()
    {
        return $this->morphOne(Kas::class, 'kasable');
    }

    protected static function booted()
    {
        static::saved(function ($operasional) {
            $operasional->kas()->updateOrCreate(
                [],
                [
                    'tanggal' => $operasional->tanggal,
                    'keterangan' => 'Biaya ' . $operasional->kategori . ': ' . ($operasional->keterangan ?? 'Tanpa keterangan'),
                    'masuk' => 0,
                    'keluar' => $operasional->nominal,
                    'sumber' => 'operasional',
                ]
            );
        });

        static::deleted(function ($operasional) {
            $operasional->kas()->delete();
        });
    }
}
