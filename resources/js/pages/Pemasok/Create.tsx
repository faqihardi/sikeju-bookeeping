import { Head } from '@inertiajs/react';
import { PemasokForm } from './createForm';
import * as suppliers from '@/actions/App/Http/Controllers/PemasokController';

export default function PemasokCreate({ pemasok }: { pemasok?: any }) {
    const isEdit = !!pemasok;
    return (
        <>
            <Head title={isEdit ? "Edit Pemasok" : "Tambah Pemasok"} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <PemasokForm pemasok={pemasok} />
            </div>
        </>
    );
}

PemasokCreate.layout = {
    breadcrumbs: [
        {
            title: 'Pemasok',
            href: suppliers.index(),
        },
    ],
};
