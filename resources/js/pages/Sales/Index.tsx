import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Penjualan } from './column';
import { columns } from './column';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { create } from '@/actions/App/Http/Controllers/PenjualanController';

export default function SalesIndex({ sales }: { sales: Penjualan[] }) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <>
            <Head title="Transaksi Penjualan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-xl font-bold">Transaksi Penjualan</h1>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Catat Penjualan
                        </Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={sales} searchKey="no_faktur" />
            </div>
        </>
    );
}
