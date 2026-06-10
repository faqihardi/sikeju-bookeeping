import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { DataTable } from '@/components/data-table';
import type { BahanBaku } from './column';
import { columns } from './column';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { create } from '@/actions/App/Http/Controllers/BahanBakuController';

export default function BahanBakuIndex({ user, materials }: { user: string, materials: BahanBaku[] }) {

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
                <DataTable columns={columns} data={materials} />
                {/* <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <DataTable columns={columns} data={data}/>
                </div> */}
            </div>
        </>
    );
}


