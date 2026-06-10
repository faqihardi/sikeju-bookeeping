<?php

namespace App\Http\Controllers;

use App\Http\Requests\Produk\StoreProdukRequest;
use App\Http\Requests\Produk\UpdateProdukRequest;
use App\Models\Produk;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index() {
        $products = Produk::orderBy('nama_produk')->get();
        return Inertia::render('Produk/Index', [
            'user' => 'Dashboard Produk',
            'products' => $products
        ]);
    }

    public function create() {
        return Inertia::render('Produk/Create');
    }

    public function store(StoreProdukRequest $request) {
        $data = $request->validated();
        $data['stok'] = $data['stok'] ?? 0; // Set default 0 jika kosong
        Produk::create($data);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');       
    }

    public function edit(Produk $product) {
        return Inertia::render('Produk/Create', [
            'product' => $product
        ]);
    }

    public function update(UpdateProdukRequest $request, Produk $product) {
        $data = $request->validated();
        unset($data['stok']); // Cegah update stok dari form edit

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Produk $product) {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
    }
}
