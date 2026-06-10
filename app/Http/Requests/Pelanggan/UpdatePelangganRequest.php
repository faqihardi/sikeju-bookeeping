<?php

namespace App\Http\Requests\Pelanggan;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePelangganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kode' => 'required|string|max:20|unique:pelanggans,kode,' . $this->route('customer')->id,
            'nama_pelanggan' => 'required|string|min:3|max:100',
            'no_telepon' => 'nullable|string|max:20',
        ];
    }
}
