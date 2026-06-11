<?php

namespace App\Http\Requests\Kas;

use Illuminate\Foundation\Http\FormRequest;

class StoreKasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal' => 'required|date',
            'tipe_penyesuaian' => 'required|string|in:masuk,keluar',
            'nominal' => 'required|numeric|min:0',
            'keterangan' => 'required|string',
        ];
    }
}
