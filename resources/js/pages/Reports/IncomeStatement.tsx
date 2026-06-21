import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah } from '@/lib/utils';
import { Calendar, Printer, TrendingUp, DollarSign, Activity, Percent } from 'lucide-react';
import * as reports from '@/actions/App/Http/Controllers/LaporanController';

interface Props {
    startDate: string;
    endDate: string;
    pendapatan: number;
    hpp: number;
    labaKotor: number;
    operasional: number;
    operasionalDetail: {
        kas: number;
        koreksiStokLoss: number;
        koreksiStokGain: number;
        penyusutan: number;
    };
    labaBersihSebelumPajak: number;
    bebanPajak: number;
    labaBersih: number;
}

export default function IncomeStatement({
    startDate,
    endDate,
    pendapatan,
    hpp,
    labaKotor,
    operasional,
    operasionalDetail,
    labaBersihSebelumPajak,
    bebanPajak,
    labaBersih,
}: Props) {
    const [filterStart, setFilterStart] = useState(startDate);
    const [filterEnd, setFilterEnd] = useState(endDate);

    function handleFilter() {
        router.visit(reports.incomeStatement().url, {
            data: {
                start_date: filterStart,
                end_date: filterEnd,
            },
            preserveState: true,
        });
    }

    function handlePrint() {
        window.open(reports.incomeStatementPdf({ query: { start_date: filterStart, end_date: filterEnd } }).url, '_blank');
    }

    const marginKotor = pendapatan > 0 ? (labaKotor / pendapatan) * 100 : 0;
    const marginBersih = pendapatan > 0 ? (labaBersih / pendapatan) * 100 : 0;

    return (
        <>
            <Head title="Laporan Laba Rugi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 print:p-0">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Laporan Laba Rugi</h1>
                        <p className="text-sm text-muted-foreground">
                            Ringkasan profitabilitas dan kinerja usaha operasional
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-2 shadow-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <Input
                                type="date"
                                value={filterStart}
                                onChange={(e) => setFilterStart(e.target.value)}
                                className="h-8 w-36 border-0 p-0 focus-visible:ring-0"
                            />
                            <span className="text-muted-foreground text-sm">s/d</span>
                            <Input
                                type="date"
                                value={filterEnd}
                                onChange={(e) => setFilterEnd(e.target.value)}
                                className="h-8 w-36 border-0 p-0 focus-visible:ring-0"
                            />
                        </div>
                        <Button onClick={handleFilter}>Terapkan</Button>
                        <Button variant="outline" size="icon" onClick={handlePrint}>
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Print Title */}
                <div className="hidden print:block text-center mb-6">
                    <h1 className="text-2xl font-bold">SIKEJU - LAPORAN LABA RUGI</h1>
                    <p className="text-sm text-muted-foreground">
                        Periode: {startDate} s/d {endDate}
                    </p>
                    <hr className="mt-4 border-t-2" />
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pendapatan Usaha</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-green-600">{formatRupiah(pendapatan)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Laba Kotor</CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-blue-600">{formatRupiah(labaKotor)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Beban Operasional</CardTitle>
                            <Activity className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-destructive">{formatRupiah(operasional)}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-primary">Laba Bersih</CardTitle>
                            <Percent className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-primary">{formatRupiah(labaBersih)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Structured Income Statement */}
                <Card className="max-w-2xl mx-auto w-full shadow-md overflow-hidden p-0 gap-0">
                    <CardHeader className="border-b bg-muted/40 pt-6 pb-4 px-6">
                        <CardTitle className="text-center font-semibold text-lg">
                            LAPORAN LABA RUGI
                        </CardTitle>
                        <p className="text-xs text-muted-foreground text-center">
                            Periode {startDate} s/d {endDate}
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6 px-6 pb-6 space-y-6">
                        
                        {/* PENDAPATAN */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold text-sm text-muted-foreground tracking-wider uppercase">
                                <span>Pendapatan</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2 pl-4">
                                <span>Pendapatan Penjualan Produk</span>
                                <span className="font-semibold">{formatRupiah(pendapatan)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold bg-muted/30 p-2 rounded">
                                <span>Total Pendapatan</span>
                                <span>{formatRupiah(pendapatan)}</span>
                            </div>
                        </div>

                        {/* HARGA POKOK PENJUALAN */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold text-sm text-muted-foreground tracking-wider uppercase">
                                <span>Harga Pokok Penjualan (HPP)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2 pl-4">
                                <span>Beban HPP Produk Terjual</span>
                                <span className="font-semibold text-destructive">({formatRupiah(hpp)})</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold bg-muted/30 p-2 rounded">
                                <span>Total HPP</span>
                                <span>({formatRupiah(hpp)})</span>
                            </div>
                        </div>

                        {/* LABA KOTOR */}
                        <div className="flex justify-between items-center p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 font-bold rounded-lg text-base">
                            <span>LABA KOTOR</span>
                            <span>{formatRupiah(labaKotor)}</span>
                        </div>

                        {/* BEBAN OPERASIONAL */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold text-sm text-muted-foreground tracking-wider uppercase">
                                <span>Beban Operasional</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2 pl-4">
                                <span>Pengeluaran Biaya Operasional (Kas)</span>
                                <span className="font-semibold text-destructive">({formatRupiah(operasionalDetail.kas)})</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2 pl-4">
                                <span>Kerugian Koreksi Stok (Barang Rusak/Hilang)</span>
                                <span className="font-semibold text-destructive">({formatRupiah(operasionalDetail.koreksiStokLoss)})</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2 pl-4">
                                <span>Keuntungan Koreksi Stok (Barang Lebih)</span>
                                <span className="font-semibold text-green-600">{formatRupiah(operasionalDetail.koreksiStokGain)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2 pl-4">
                                <span>Beban Penyusutan Peralatan</span>
                                <span className="font-semibold text-destructive">({formatRupiah(operasionalDetail.penyusutan)})</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold bg-muted/30 p-2 rounded">
                                <span>Total Beban Operasional</span>
                                <span>({formatRupiah(operasional)})</span>
                            </div>
                        </div>

                        {/* LABA BERSIH SEBELUM PAJAK */}
                        <div className={`flex justify-between items-center p-4 border font-extrabold rounded-lg text-lg shadow-sm ${
                            labaBersihSebelumPajak >= 0 
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/25 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
                                : 'bg-destructive/10 dark:bg-destructive/25 border-destructive/30 text-destructive'
                        }`}>
                            <span>LABA BERSIH OPERASIONAL</span>
                            <span>{formatRupiah(labaBersihSebelumPajak)}</span>
                        </div>

                        {/* BEBAN PAJAK */}
                        <div className="space-y-2">
                            <div className="flex justify-between font-bold text-sm text-muted-foreground tracking-wider uppercase">
                                <span>Kewajiban Pajak</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2 pl-4">
                                <span>Beban Pajak PPh Final UMKM (0.5% Omzet)</span>
                                <span className="font-semibold text-destructive">({formatRupiah(bebanPajak)})</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold bg-muted/30 p-2 rounded">
                                <span>Total Beban Pajak</span>
                                <span>({formatRupiah(bebanPajak)})</span>
                            </div>
                        </div>

                        {/* LABA BERSIH SETELAH PAJAK */}
                        <div className={`flex justify-between items-center p-4 border font-extrabold rounded-lg text-lg shadow-sm ${
                            labaBersih >= 0 
                                ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white dark:text-gray-950' 
                                : 'bg-destructive border-destructive text-white'
                        }`}>
                            <span>LABA BERSIH SETELAH PAJAK</span>
                            <span>{formatRupiah(labaBersih)}</span>
                        </div>

                        {/* ANALISIS MARGIN */}
                        <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xs text-muted-foreground">
                            <div>
                                <span className="block text-muted-foreground">Margin Laba Kotor:</span>
                                <span className="font-bold text-foreground text-sm">{marginKotor.toFixed(1)}%</span>
                            </div>
                            <div>
                                <span className="block text-muted-foreground">Margin Laba Bersih:</span>
                                <span className="font-bold text-foreground text-sm">{marginBersih.toFixed(1)}%</span>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </>
    );
}

IncomeStatement.layout = {
    breadcrumbs: [
        { title: 'Laporan Keuangan', href: '#' },
        { title: 'Laba Rugi', href: reports.incomeStatement() },
    ],
};
