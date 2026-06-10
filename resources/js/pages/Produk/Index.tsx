import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Produk } from './column';
import { columns } from './column';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, PackageOpen, CircleDollarSign } from 'lucide-react';
import { create } from '@/actions/App/Http/Controllers/ProdukController';

export default function ProdukIndex({ user, products }: { user: string, products: Produk[] }) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const totalProduk = products.length;
    const totalStok = products.reduce((sum, item) => sum + Number(item.stok), 0);
    const totalNilai = products.reduce((sum, item) => sum + (Number(item.stok) * Number(item.harga_jual)), 0);

    return (
        <>
            <Head title="Produk Jadi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-xl font-bold">{user}</h1>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
                        </Button>
                    </Link>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3 mb-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Item Produk</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProduk}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stok Gudang</CardTitle>
                            <PackageOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStok}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Estimasi Nilai Jual</CardTitle>
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalNilai)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DataTable columns={columns} data={products} searchKey="nama_produk" />
            </div>
        </>
    );
}
