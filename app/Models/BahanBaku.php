<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BahanBaku extends Model
{
    protected $table = 'bahan_bakus';

    protected $guarded = [];

    public function detailPembelians(): HasMany
    {
        return $this->hasMany(DetailPembelian::class);
    }

    public function reseps(): HasMany
    {
        return $this->hasMany(Resep::class);
    }

    public function pemakaianBahans(): HasMany
    {
        return $this->hasMany(PemakaianBahan::class);
    }
}
