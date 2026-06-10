<?php

namespace App\Http\Requests\PengeluaranOperasional;

use Illuminate\Foundation\Http\FormRequest;

class StorePengeluaranOperasionalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal' => 'required|date',
            'kategori' => 'required|string|in:Gaji,Utilitas (Listrik/Air),Sewa Tempat,Transportasi & Bensin,Lain-lain',
            'nominal' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ];
    }
}
