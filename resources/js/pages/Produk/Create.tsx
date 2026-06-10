import { Head } from '@inertiajs/react';
import { ProdukForm } from './createForm';
import * as products from '@/actions/App/Http/Controllers/ProdukController';

export default function ProdukCreate({ product, defaultKode }: { product?: any, defaultKode?: string }) {
    const isEdit = !!product;
    return (
        <>
            <Head title={isEdit ? "Edit Produk" : "Tambah Produk"} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <ProdukForm product={product} defaultKode={defaultKode} />
            </div>
        </>
    );
}

ProdukCreate.layout = {
    breadcrumbs: [
        {
            title: 'Produk',
            href: products.index(),
        },
    ],
};
