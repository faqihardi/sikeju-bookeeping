import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { DataTable } from '@/components/data-table';
import type { BahanBaku } from './column';
import { columns } from './column';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Wheat, PackageOpen, CircleDollarSign } from 'lucide-react';
import { create } from '@/actions/App/Http/Controllers/BahanBakuController';

export default function BahanBakuIndex({ user, materials }: { user: string, materials: BahanBaku[] }) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const totalBahan = materials.length;
    const totalStok = materials.reduce((sum, item) => sum + Number(item.stok), 0);
    const totalNilai = materials.reduce((sum, item) => sum + (Number(item.stok) * Number(item.harga_satuan)), 0);

    return (
        <>
            <Head title="Bahan Baku" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <h1 className="text-xl font-bold">{user}</h1>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Bahan Baku
                        </Button>
                    </Link>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3 mb-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Item Bahan Baku</CardTitle>
                            <Wheat className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalBahan}</div>
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
                            <CardTitle className="text-sm font-medium">Estimasi Nilai Stok</CardTitle>
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalNilai)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DataTable columns={columns} data={materials} searchKey="nama_bahan" />
                {/* <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <DataTable columns={columns} data={data}/>
                </div> */}
            </div>
        </>
    );
}


