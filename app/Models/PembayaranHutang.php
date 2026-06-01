<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PembayaranHutang extends Model
{
    protected $table = 'pembayaran_hutangs';

    protected $guarded = [];

    public function hutang(): BelongsTo
    {
        return $this->belongsTo(Hutang::class);
    }
}
