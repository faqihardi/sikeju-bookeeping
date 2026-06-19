import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';
import { Calendar, Printer, TrendingUp, Landmark, ShieldAlert, FileText, Info } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import * as reports from '@/actions/App/Http/Controllers/LaporanController';

interface MonthlyDataItem {
    month_number: number;
    month_name: string;
    omzet: number;
    tax: number;
    paid: number;
    due_date: string;
}

interface Props {
    selectedYear: number;
    years: number[];
    yearlyTotalOmzet: number;
    yearlyTotalTax: number;
    yearlyTotalPaidTax: number;
    monthlyData: MonthlyDataItem[];
}

export default function TaxReport({
    selectedYear,
    years,
    yearlyTotalOmzet,
    yearlyTotalTax,
    yearlyTotalPaidTax,
    monthlyData,
}: Props) {
    const [year, setYear] = useState(selectedYear);

    function handleYearChange(newYear: string) {
        const val = parseInt(newYear, 10);
        setYear(val);
        router.visit(reports.taxReport().url, {
            data: {
                year: val,
            },
            preserveState: true,
        });
    }

    function handlePrint() {
        window.open(reports.taxReportPdf({ query: { year } }).url, '_blank');
    }

    // Chart Data mapping
    const chartData = monthlyData.map((item) => ({
        name: item.month_name.substring(0, 3),
        'Omzet Bruto': item.omzet,
        'Estimasi PPh': item.tax,
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover text-popover-foreground border rounded-lg shadow-md p-3 text-xs">
                    <p className="font-semibold mb-1 text-muted-foreground">{label}</p>
                    <div className="space-y-1">
                        <p className="flex justify-between gap-4">
                            <span className="text-blue-500 font-medium">Omzet Bruto:</span>
                            <span className="font-bold">{formatRupiah(payload[0].value)}</span>
                        </p>
                        <p className="flex justify-between gap-4">
                            <span className="text-red-500 font-medium">Estimasi PPh:</span>
                            <span className="font-bold">{formatRupiah(payload[1].value)}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Head title="Laporan Pajak (PPh Final)" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 print:p-0">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Laporan Pajak (PPh Final 0,5%)</h1>
                        <p className="text-sm text-muted-foreground">
                            Rekapitulasi PPh Final UMKM CV berdasarkan PP 55 Tahun 2022
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-lg border bg-card p-2 shadow-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground mr-1">Tahun Pajak:</span>
                            <Select value={year.toString()} onValueChange={handleYearChange}>
                                <SelectTrigger className="h-8 w-24 border-0 p-0 focus:ring-0 focus-visible:ring-0">
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((y) => (
                                        <SelectItem key={y} value={y.toString()}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" size="icon" onClick={handlePrint}>
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Print Header */}
                <div className="hidden print:block text-center mb-6">
                    <h1 className="text-2xl font-bold">SIKEJU - LAPORAN PAJAK PPh FINAL (PP 55/2022)</h1>
                    <p className="text-sm text-muted-foreground">Tahun Pajak: {selectedYear}</p>
                    <hr className="mt-4 border-t-2" />
                </div>

                {/* Info Alert Box */}
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-blue-700 dark:text-blue-300 flex items-start gap-3 print:border-neutral-300 print:bg-transparent print:text-black">
                    <Info className="h-5 w-5 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400 print:text-black" />
                    <div className="text-xs space-y-1">
                        <span className="font-bold block text-sm mb-1">Ketentuan PPh Final UMKM (CV)</span>
                        <p>
                            Sesuai dengan <strong>PP No. 55 Tahun 2022</strong>, entitas berbentuk <strong>Badan Usaha (CV)</strong> dikenakan Pajak Penghasilan (PPh) Final sebesar <strong>0,5% flat</strong> dari omzet (peredaran bruto) setiap bulannya.
                        </p>
                        <p>
                            Berbeda dengan Wajib Pajak Orang Pribadi, entitas berbentuk Badan Usaha <strong>tidak mendapatkan</strong> fasilitas pembebasan PTKP omzet Rp 500 juta pertahun. PPh Final langsung dikenakan dari rupiah pertama peredaran bruto. Batas waktu penyetoran pajak terutang adalah maksimal tanggal <strong>15 bulan berikutnya</strong>.
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Omzet Bruto</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{formatRupiah(yearlyTotalOmzet)}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Total penjualan setahun penuh</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-destructive">PPh Final Terutang (0.5%)</CardTitle>
                            <Landmark className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-destructive">{formatRupiah(yearlyTotalTax)}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Total kewajiban pajak terestimasi</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-600">PPh Final Dibayar (Riil)</CardTitle>
                            <FileText className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-emerald-600">{formatRupiah(yearlyTotalPaidTax)}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Berdasarkan pencatatan biaya operasional</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden shadow-sm bg-primary/5 dark:bg-primary/10 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-primary">Status Entitas</CardTitle>
                            <ShieldAlert className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <div className="text-base font-bold text-primary">CV (Badan Usaha)</div>
                            <Badge variant="secondary" className="text-[10px] w-fit font-semibold px-2 py-0.5 mt-0.5">
                                Tarif Flat 0,5%
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* Visual Chart */}
                <div className="grid gap-6 grid-cols-1">
                    <Card className="shadow-sm overflow-hidden flex flex-col p-0 gap-0 min-h-[380px] print:hidden">
                        <CardHeader className="border-b bg-muted/40 pt-6 pb-4 px-6">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Grafik Tren Omzet vs PPh Final Terutang ({selectedYear})
                            </CardTitle>
                            <CardDescription>
                                Perbandingan visual omzet bruto bulanan dengan estimasi pajak
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col justify-between">
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-[10px] fill-muted-foreground" />
                                        <YAxis yAxisId="left" axisLine={false} tickLine={false} className="text-[10px] fill-muted-foreground" tickFormatter={(val) => `Rp ${val/1000}k`} />
                                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} className="text-[10px] fill-muted-foreground" tickFormatter={(val) => `Rp ${val/1000}k`} />
                                        <ChartTooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="top" height={36} iconType="circle" className="text-xs" />
                                        <Bar yAxisId="left" name="Omzet Bruto" dataKey="Omzet Bruto" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                        <Bar yAxisId="right" name="PPh Final (0,5%)" dataKey="Estimasi PPh" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recap Table */}
                <Card className="shadow-sm overflow-hidden p-0 gap-0">
                    <CardHeader className="border-b bg-muted/40 pt-6 pb-4 px-6">
                        <CardTitle className="text-base font-semibold">Rekapitulasi Bulanan Pajak Penghasilan</CardTitle>
                        <CardDescription>
                            Rincian perhitungan pajak dan status setoran setiap bulan pada tahun {selectedYear}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bulan</TableHead>
                                    <TableHead className="text-right">Omzet Bruto</TableHead>
                                    <TableHead className="text-right">PPh Final Terutang (0,5%)</TableHead>
                                    <TableHead className="text-right">Telah Dibayar (Riil)</TableHead>
                                    <TableHead className="text-right">Kurang/Lebih Bayar</TableHead>
                                    <TableHead className="text-center">Batas Penyetoran</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthlyData.map((row) => {
                                    const diff = row.tax - row.paid;
                                    let statusNode = null;

                                    if (row.tax === 0) {
                                        statusNode = <Badge variant="secondary" className="text-[10px]">Nihil</Badge>;
                                    } else if (diff <= 0) {
                                        statusNode = <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 text-[10px] border-emerald-500/25">Lunas</Badge>;
                                    } else if (row.paid > 0) {
                                        statusNode = <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 text-[10px] border-amber-500/25">Kurang Bayar</Badge>;
                                    } else {
                                        statusNode = <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 text-[10px]">Belum Bayar</Badge>;
                                    }

                                    return (
                                        <TableRow key={row.month_number}>
                                            <TableCell className="font-semibold">{row.month_name}</TableCell>
                                            <TableCell className="text-right font-medium">{formatRupiah(row.omzet)}</TableCell>
                                            <TableCell className="text-right font-semibold text-destructive">{formatRupiah(row.tax)}</TableCell>
                                            <TableCell className="text-right font-medium text-emerald-600">{formatRupiah(row.paid)}</TableCell>
                                            <TableCell className={`text-right font-semibold ${diff > 0 ? 'text-amber-600' : diff < 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                                {diff === 0 ? '-' : formatRupiah(Math.abs(diff))}
                                            </TableCell>
                                            <TableCell className="text-center text-xs text-muted-foreground">{row.due_date}</TableCell>
                                            <TableCell className="text-center">{statusNode}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TaxReport.layout = {
    breadcrumbs: [
        { title: 'Laporan Keuangan', href: '#' },
        { title: 'Laporan Pajak', href: reports.taxReport() },
    ],
};
