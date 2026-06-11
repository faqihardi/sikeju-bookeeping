import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Pembelian } from './column';
import { columns } from './column';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart, Banknote, TrendingDown } from 'lucide-react';
import { create, index } from '@/actions/App/Http/Controllers/PembelianController';
import { formatRupiah } from '@/lib/utils';

interface Props {
    purchases: Pembelian[]
}

export default function PurchasesIndex({ purchases }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const totalTransaksi = purchases.length;
    const totalNilai = purchases.reduce((sum, p) => sum + Number(p.total), 0);
    const totalKredit = purchases.filter(p => p.hutang !== null && p.hutang.status === 'belum_lunas').reduce((sum, p) => sum + Number(p.total), 0);

    return (
        <>
            <Head title="Transaksi Pembelian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-xl font-bold">Transaksi Pembelian</h1>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Pembelian
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalTransaksi}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Nilai Pembelian</CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatRupiah(totalNilai)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Kredit Berjalan</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatRupiah(totalKredit)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DataTable columns={columns} data={purchases} searchKey="nama_pembelian" />
            </div>
        </>
    );
}

PurchasesIndex.layout = {
    breadcrumbs: [
        { title: 'Transaksi Pembelian', href: index() },
    ],
};
