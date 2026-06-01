<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hutang extends Model
{
    protected $table = 'hutangs';

    protected $guarded = [];

    public function pembelian(): BelongsTo
    {
        return $this->belongsTo(Pembelian::class);
    }

    public function peralatan(): BelongsTo
    {
        return $this->belongsTo(Peralatan::class);
    }

    public function pembayaranHutangs(): HasMany
    {
        return $this->hasMany(PembayaranHutang::class);
    }
}
