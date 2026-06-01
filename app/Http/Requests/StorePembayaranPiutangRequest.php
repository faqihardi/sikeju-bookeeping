<?php

namespace App\Http\Requests;

use App\Models\Piutang;
use Illuminate\Foundation\Http\FormRequest;

class StorePembayaranPiutangRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'piutang_id' => ['required','exists:piutangs,id'],
            'nominal_bayar' => ['required','numeric','min:0.01'],
            'tanggal' => ['required','date'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $data = $this->input();
            $piutang = Piutang::find($data['piutang_id'] ?? null);
            if (! $piutang) {
                return;
            }

            $totalTerima = $piutang->pembayaranPiutangs()->sum('nominal_bayar');
            $incoming = $data['nominal_bayar'] ?? 0;
            if (($totalTerima + $incoming) > $piutang->nominal) {
                $validator->errors()->add('nominal_bayar', 'Pembayaran melebihi sisa piutang');
            }
        });
    }
}
