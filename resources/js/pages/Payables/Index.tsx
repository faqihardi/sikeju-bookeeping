import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Hutang } from './column';
import { columns } from './column';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Field,
    FieldLabel,
    FieldError,
} from '@/components/ui/field';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, AlertCircle, CheckCircle2, CreditCard } from 'lucide-react';
import * as payablesAction from '@/actions/App/Http/Controllers/HutangController';
import { formatRupiah } from '@/lib/utils';

interface Props {
    payables: Hutang[]
}

export default function PayablesIndex({ payables }: Props) {
    const { flash } = usePage().props as any;
    const [selectedHutang, setSelectedHutang] = useState<Hutang | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const form = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        nominal_bayar: '',
    });

    // Hitung summary
    const totalBerjalan = payables
        .filter(h => h.status === 'belum_lunas')
        .reduce((sum, h) => {
            const dibayar = h.pembayaran_hutangs.reduce((s, p) => s + Number(p.nominal_bayar), 0);
            return sum + (Number(h.nominal) - dibayar);
        }, 0);

    const jatuhTempoIni = payables
        .filter(h => {
            if (h.status !== 'belum_lunas') return false;
            const tgl = new Date(h.tgl_jatuh_tempo);
            const now = new Date();
            return tgl.getMonth() === now.getMonth() && tgl.getFullYear() === now.getFullYear();
        })
        .reduce((sum, h) => {
            const dibayar = h.pembayaran_hutangs.reduce((s, p) => s + Number(p.nominal_bayar), 0);
            return sum + (Number(h.nominal) - dibayar);
        }, 0);

    const totalLunas = payables
        .filter(h => h.status === 'lunas')
        .reduce((sum, h) => sum + Number(h.nominal), 0);

    function openBayarDialog(hutang: Hutang) {
        setSelectedHutang(hutang);
        form.reset();
        form.setData('tanggal', new Date().toISOString().split('T')[0]);
        setIsDialogOpen(true);
    }

    function submitBayar(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedHutang) return;

        const action = payablesAction.bayarCicilan(selectedHutang.id);
        form.submit(action.method, action.url, {
            onSuccess: () => {
                toast.success('Pembayaran cicilan hutang berhasil.');
                setIsDialogOpen(false);
            },
            onError: () => {
                toast.error('Terdapat kesalahan. Silakan periksa kembali.');
            }
        });
    }

    // Hitung sisa hutang untuk hutang yang dipilih
    const sisaHutangTerpilih = selectedHutang
        ? Number(selectedHutang.nominal) - selectedHutang.pembayaran_hutangs.reduce((s, p) => s + Number(p.nominal_bayar), 0)
        : 0;

    // Extend columns dengan aksi bayar
    const columnsWithAction = [
        ...columns,
        {
            id: 'bayar',
            cell: ({ row }: any) => {
                const hutang: Hutang = row.original;
                if (hutang.status === 'lunas') return null;
                return (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openBayarDialog(hutang)}
                        className="gap-1"
                    >
                        <CreditCard className="h-3.5 w-3.5" /> Bayar Cicilan
                    </Button>
                );
            }
        }
    ];

    return (
        <>
            <Head title="Hutang Usaha" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-xl font-bold">Hutang Usaha</h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hutang Berjalan</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatRupiah(totalBerjalan)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Sisa yang belum dibayar</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jatuh Tempo Bulan Ini</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {formatRupiah(jatuhTempoIni)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Hutang jatuh tempo bulan ini</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hutang Lunas</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatRupiah(totalLunas)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Hutang yang sudah dilunasi</p>
                        </CardContent>
                    </Card>
                </div>

                <DataTable columns={columnsWithAction} data={payables} searchKey="status" />
            </div>

            {/* Dialog Bayar Cicilan */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Bayar Cicilan Hutang</DialogTitle>
                        <DialogDescription>
                            {selectedHutang && (
                                <span>
                                    Sumber: <strong>{selectedHutang.pembelian?.nama_pembelian ?? '-'}</strong>
                                    <br />
                                    Sisa hutang: <strong className="text-red-600">{formatRupiah(sisaHutangTerpilih)}</strong>
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitBayar} className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="tanggal_bayar">Tanggal Pembayaran</FieldLabel>
                            <Input
                                id="tanggal_bayar"
                                type="date"
                                value={form.data.tanggal}
                                onChange={e => form.setData('tanggal', e.target.value)}
                            />
                            {form.errors.tanggal && <FieldError>{form.errors.tanggal}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="nominal_bayar">Nominal Bayar (Rp)</FieldLabel>
                            <Input
                                id="nominal_bayar"
                                type="number"
                                min="1"
                                max={sisaHutangTerpilih}
                                placeholder={`Maks: ${formatRupiah(sisaHutangTerpilih)}`}
                                value={form.data.nominal_bayar}
                                onChange={e => form.setData('nominal_bayar', e.target.value)}
                            />
                            {form.errors.nominal_bayar && <FieldError>{form.errors.nominal_bayar}</FieldError>}
                        </Field>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Memproses...' : 'Bayar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

PayablesIndex.layout = {
    breadcrumbs: [
        { title: 'Hutang Usaha', href: payablesAction.index() },
    ],
};
