<?php

namespace App\Http\Requests\BahanBaku;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBahanBakuRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_bahan' => 'required|string|min:3|max:100',
            'satuan'=> 'required|string',
            'harga_satuan' => 'required|numeric|min:1'
        ];
    }
}
