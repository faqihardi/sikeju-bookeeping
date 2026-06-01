<?php

namespace App\Http\Requests;

use App\Models\Hutang;
use Illuminate\Foundation\Http\FormRequest;

class StorePembayaranHutangRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hutang_id' => ['required','exists:hutangs,id'],
            'nominal_bayar' => ['required','numeric','min:0.01'],
            'tanggal' => ['required','date'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $data = $this->input();
            $hutang = Hutang::find($data['hutang_id'] ?? null);
            if (! $hutang) {
                return;
            }

            $totalBayar = $hutang->pembayaranHutangs()->sum('nominal_bayar');
            $incoming = $data['nominal_bayar'] ?? 0;
            if (($totalBayar + $incoming) > $hutang->nominal) {
                $validator->errors()->add('nominal_bayar', 'Pembayaran melebihi sisa hutang');
            }
        });
    }
}
