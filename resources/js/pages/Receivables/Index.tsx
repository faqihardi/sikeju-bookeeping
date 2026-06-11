import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Piutang } from './column';
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
import { TrendingUp, AlertCircle, CheckCircle2, CreditCard } from 'lucide-react';
import * as receivablesAction from '@/actions/App/Http/Controllers/PiutangController';
import { formatRupiah } from '@/lib/utils';

interface Props {
    receivables: Piutang[]
}

export default function ReceivablesIndex({ receivables }: Props) {
    const { flash } = usePage().props as any;
    const [selectedPiutang, setSelectedPiutang] = useState<Piutang | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const form = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        nominal_bayar: '',
    });

    // Hitung summary metrics
    const totalBerjalan = receivables
        .filter(r => r.status === 'belum_lunas')
        .reduce((sum, r) => {
            const dibayar = r.pembayaran_piutangs.reduce((s, p) => s + Number(p.nominal_bayar), 0);
            return sum + (Number(r.nominal) - dibayar);
        }, 0);

    const jatuhTempoIni = receivables
        .filter(r => {
            if (r.status !== 'belum_lunas') return false;
            const tgl = new Date(r.tgl_jatuh_tempo);
            const now = new Date();
            return tgl.getMonth() === now.getMonth() && tgl.getFullYear() === now.getFullYear();
        })
        .reduce((sum, r) => {
            const dibayar = r.pembayaran_piutangs.reduce((s, p) => s + Number(p.nominal_bayar), 0);
            return sum + (Number(r.nominal) - dibayar);
        }, 0);

    const totalLunas = receivables
        .filter(r => r.status === 'lunas')
        .reduce((sum, r) => sum + Number(r.nominal), 0);

    function openBayarDialog(piutang: Piutang) {
        setSelectedPiutang(piutang);
        form.reset();
        form.setData('tanggal', new Date().toISOString().split('T')[0]);
        setIsDialogOpen(true);
    }

    function submitBayar(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedPiutang) return;

        const action = receivablesAction.bayarCicilan(selectedPiutang.id);
        form.submit(action.method, action.url, {
            onSuccess: () => {
                toast.success('Penerimaan cicilan piutang berhasil.');
                setIsDialogOpen(false);
            },
            onError: () => {
                toast.error('Terdapat kesalahan. Silakan periksa kembali.');
            }
        });
    }

    // Hitung sisa piutang untuk piutang yang dipilih
    const sisaPiutangTerpilih = selectedPiutang
        ? Number(selectedPiutang.nominal) - selectedPiutang.pembayaran_piutangs.reduce((s, p) => s + Number(p.nominal_bayar), 0)
        : 0;

    // Extend columns dengan aksi bayar
    const columnsWithAction = [
        ...columns,
        {
            id: 'bayar',
            cell: ({ row }: any) => {
                const piutang: Piutang = row.original;
                if (piutang.status === 'lunas') return null;
                return (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openBayarDialog(piutang)}
                        className="gap-1"
                    >
                        <CreditCard className="h-3.5 w-3.5" /> Terima Pembayaran
                    </Button>
                );
            }
        }
    ];

    return (
        <>
            <Head title="Piutang Usaha" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-xl font-bold">Piutang Usaha</h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Piutang Berjalan</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatRupiah(totalBerjalan)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Sisa yang belum ditagih</p>
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
                            <p className="text-xs text-muted-foreground mt-1">Piutang jatuh tempo bulan ini</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Piutang Lunas</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatRupiah(totalLunas)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Piutang yang sudah lunas</p>
                        </CardContent>
                    </Card>
                </div>

                <DataTable columns={columnsWithAction} data={receivables} searchKey="status" />
            </div>

            {/* Dialog Terima Cicilan */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Terima Pembayaran Piutang</DialogTitle>
                        <DialogDescription>
                            {selectedPiutang && (
                                <span>
                                    No. Faktur: <strong>{selectedPiutang.penjualan?.no_faktur ?? '-'}</strong>
                                    <br />
                                    Pelanggan: <strong>{selectedPiutang.penjualan?.pelanggan?.nama_pelanggan ?? '-'}</strong>
                                    <br />
                                    Sisa tagihan: <strong className="text-red-600">{formatRupiah(sisaPiutangTerpilih)}</strong>
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitBayar} className="space-y-4">
                        <Field>
                            <FieldLabel htmlFor="tanggal_bayar">Tanggal Penerimaan</FieldLabel>
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
                                max={sisaPiutangTerpilih}
                                placeholder={`Maks: ${formatRupiah(sisaPiutangTerpilih)}`}
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
                                {form.processing ? 'Memproses...' : 'Terima Pembayaran'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

ReceivablesIndex.layout = {
    breadcrumbs: [
        { title: 'Piutang Usaha', href: receivablesAction.index() },
    ],
};
