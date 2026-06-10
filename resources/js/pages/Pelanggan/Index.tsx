import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Pelanggan } from './column';
import { columns } from './column';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, PhoneCall } from 'lucide-react';
import { create } from '@/actions/App/Http/Controllers/PelangganController';

export default function PelangganIndex({ customers }: { customers: Pelanggan[] }) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const totalPelanggan = customers.length;
    const denganTelp = customers.filter(c => c.no_telepon).length;

    return (
        <>
            <Head title="Daftar Pelanggan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-xl font-bold">Data Pelanggan</h1>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Pelanggan
                        </Button>
                    </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPelanggan}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Memiliki No. Telepon</CardTitle>
                            <PhoneCall className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{denganTelp}</div>
                        </CardContent>
                    </Card>
                </div>

                <DataTable columns={columns} data={customers} searchKey="nama_pelanggan" />
            </div>
        </>
    );
}
