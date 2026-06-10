<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pelanggan\StorePelangganRequest;
use App\Http\Requests\Pelanggan\UpdatePelangganRequest;
use App\Models\Pelanggan;
use Inertia\Inertia;

class PelangganController extends Controller
{
    public function index()
    {
        $customers = Pelanggan::orderBy('nama_pelanggan')->get();
        return Inertia::render('Pelanggan/Index', [
            'customers' => $customers
        ]);
    }

    public function create()
    {
        return Inertia::render('Pelanggan/Create');
    }

    public function store(StorePelangganRequest $request)
    {
        $data = $request->validated();
        Pelanggan::create($data);

        return redirect()->route('customers.index')->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    public function edit(Pelanggan $customer)
    {
        return Inertia::render('Pelanggan/Create', [
            'pelanggan' => $customer
        ]);
    }

    public function update(UpdatePelangganRequest $request, Pelanggan $customer)
    {
        $data = $request->validated();
        $customer->update($data);

        return redirect()->route('customers.index')->with('success', 'Pelanggan berhasil diperbarui.');
    }

    public function destroy(Pelanggan $customer)
    {
        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Pelanggan berhasil dihapus.');
    }
}
