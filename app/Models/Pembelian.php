<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pembelian extends Model
{
    protected $table = 'pembelians';

    protected $guarded = [];

    public function metodePembayaran(): BelongsTo
    {
        return $this->belongsTo(MetodePembayaran::class);
    }

    public function pemasok(): BelongsTo
    {
        return $this->belongsTo(Pemasok::class);
    }

    public function detailPembelians(): HasMany
    {
        return $this->hasMany(DetailPembelian::class);
    }

    public function hutang(): HasOne
    {
        return $this->hasOne(Hutang::class, 'pembelian_id');
    }
}
