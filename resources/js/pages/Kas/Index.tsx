import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { KasType } from './column';
import { columns } from './column';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowUpCircle, ArrowDownCircle, Landmark, X } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { CreateAdjustment } from './CreateAdjustment';

interface Metrics {
    totalMasuk: number;
    totalKeluar: number;
    saldoSaatIni: number;
}

export default function KasIndex({ transactions, metrics }: { transactions: KasType[], metrics: Metrics }) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Local filters state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sumber, setSumber] = useState('all');

    // Filter transactions
    const filteredTransactions = transactions.filter(t => {
        if (startDate && t.tanggal && t.tanggal < startDate) return false;
        if (endDate && t.tanggal && t.tanggal > endDate) return false;
        if (sumber !== 'all' && t.sumber !== sumber) return false;
        return true;
    });

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setSumber('all');
    };

    return (
        <>
            <Head title="Buku Kas Umum" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1 className="text-xl font-bold">Buku Kas Umum</h1>
                    <CreateAdjustment />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Uang Masuk</CardTitle>
                            <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatRupiah(metrics.totalMasuk)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Uang Keluar</CardTitle>
                            <ArrowDownCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatRupiah(metrics.totalKeluar)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Kas Saat Ini</CardTitle>
                            <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${metrics.saldoSaatIni >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600'}`}>
                                {formatRupiah(metrics.saldoSaatIni)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col md:flex-row items-end md:items-center gap-4 bg-muted/40 p-4 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Dari Tanggal</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-background"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Sampai Tanggal</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-background"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-muted-foreground">Sumber Aliran Kas</label>
                            <Select value={sumber} onValueChange={setSumber}>
                                <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Semua Sumber" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Sumber</SelectItem>
                                    <SelectItem value="modal">Setoran Modal</SelectItem>
                                    <SelectItem value="operasional">Biaya Operasional</SelectItem>
                                    <SelectItem value="pembelian">Pembelian</SelectItem>
                                    <SelectItem value="penjualan">Penjualan</SelectItem>
                                    <SelectItem value="hutang">Hutang Usaha</SelectItem>
                                    <SelectItem value="piutang">Piutang Usaha</SelectItem>
                                    <SelectItem value="peralatan">Peralatan</SelectItem>
                                    <SelectItem value="lainnya">Penyesuaian Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {(startDate || endDate || sumber !== 'all') && (
                        <Button variant="outline" size="icon" onClick={resetFilters} className="shrink-0" title="Hapus Filter">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <DataTable columns={columns} data={filteredTransactions} searchKey="keterangan" />
            </div>
        </>
    );
}
