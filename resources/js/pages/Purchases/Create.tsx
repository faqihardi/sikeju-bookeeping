import { Head } from '@inertiajs/react';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import * as purchasesAction from '@/actions/App/Http/Controllers/PembelianController';
import { formatRupiah } from '@/lib/utils';

interface BahanBaku {
    id: number
    nama_bahan: string
    satuan: string
    harga_satuan: number
}

interface Pemasok {
    id: number
    nama_pemasok: string
}

interface MetodePembayaran {
    id: number
    nama_metode: string
}

interface Props {
    bahanBakus: BahanBaku[]
    pemasoks: Pemasok[]
    metodePembayarans: MetodePembayaran[]
}

interface Item {
    bahan_baku_id: string
    qty: string
    harga_satuan: string
}

export default function PurchasesCreate({ bahanBakus, pemasoks, metodePembayarans }: Props) {
    const [jenisPembayaran, setJenisPembayaran] = useState<'Tunai' | 'Kredit'>('Tunai');
    const [items, setItems] = useState<Item[]>([
        { bahan_baku_id: '', qty: '', harga_satuan: '' }
    ]);

    const form = useForm({
        pemasok_id: '',
        metode_pembayaran_id: '',
        nama_pembelian: '',
        jenis_pembayaran: 'Tunai' as 'Tunai' | 'Kredit',
        tgl_jatuh_tempo: '',
        items: [] as Item[],
    });

    function addItem() {
        setItems(prev => [...prev, { bahan_baku_id: '', qty: '', harga_satuan: '' }]);
    }

    function removeItem(index: number) {
        if (items.length === 1) return;
        setItems(prev => prev.filter((_, i) => i !== index));
    }

    function updateItem(index: number, field: keyof Item, value: string) {
        setItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            // Auto-fill harga_satuan dari master data saat bahan dipilih
            if (field === 'bahan_baku_id') {
                const bahan = bahanBakus.find(b => b.id === Number(value));
                if (bahan) {
                    updated[index].harga_satuan = String(bahan.harga_satuan);
                }
            }
            return updated;
        });
    }

    function handleJenisChange(val: 'Tunai' | 'Kredit') {
        setJenisPembayaran(val);
        form.setData('jenis_pembayaran', val);
    }

    function calculateSubtotal(item: Item): number {
        return Number(item.qty) * Number(item.harga_satuan);
    }

    function calculateTotal(): number {
        return items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
    }

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const action = purchasesAction.store();
        form.transform((data) => ({ ...data, items }));
        form.submit(action.method, action.url, {
            onSuccess: () => {
                toast.success('Transaksi Pembelian Berhasil Dicatat.');
            },
            onError: () => {
                toast.error('Terdapat kesalahan pada form. Silakan periksa kembali.');
            }
        });
    }

    return (
        <>
            <Head title="Tambah Pembelian" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <form onSubmit={submit} className="space-y-6 max-w-4xl">

                    {/* Header Pembelian */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Informasi Pembelian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="nama_pembelian">Nama / Keterangan Pembelian</FieldLabel>
                                    <Input
                                        id="nama_pembelian"
                                        placeholder="Contoh: Restock Tepung & Keju Minggu 1"
                                        value={form.data.nama_pembelian}
                                        onChange={e => form.setData('nama_pembelian', e.target.value)}
                                    />
                                    {form.errors.nama_pembelian && <FieldError>{form.errors.nama_pembelian}</FieldError>}
                                </Field>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="pemasok_id">Pemasok</FieldLabel>
                                        <Select
                                            value={form.data.pemasok_id}
                                            onValueChange={val => form.setData('pemasok_id', val)}
                                        >
                                            <SelectTrigger id="pemasok_id" className="w-full">
                                                <SelectValue placeholder="Pilih pemasok" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pemasoks.map(p => (
                                                    <SelectItem key={p.id} value={String(p.id)}>{p.nama_pemasok}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.errors.pemasok_id && <FieldError>{form.errors.pemasok_id}</FieldError>}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="metode_pembayaran_id">Metode Pembayaran</FieldLabel>
                                        <Select
                                            value={form.data.metode_pembayaran_id}
                                            onValueChange={val => form.setData('metode_pembayaran_id', val)}
                                        >
                                            <SelectTrigger id="metode_pembayaran_id" className="w-full">
                                                <SelectValue placeholder="Pilih metode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {metodePembayarans.map(m => (
                                                    <SelectItem key={m.id} value={String(m.id)}>{m.nama_metode}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.errors.metode_pembayaran_id && <FieldError>{form.errors.metode_pembayaran_id}</FieldError>}
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel>Jenis Pembayaran</FieldLabel>
                                        <div className="flex gap-3 mt-1">
                                            {(['Tunai', 'Kredit'] as const).map(jenis => (
                                                <button
                                                    key={jenis}
                                                    type="button"
                                                    onClick={() => handleJenisChange(jenis)}
                                                    className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${jenisPembayaran === jenis
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-input bg-background hover:bg-accent'
                                                    }`}
                                                >
                                                    {jenis}
                                                </button>
                                            ))}
                                        </div>
                                        {form.errors.jenis_pembayaran && <FieldError>{form.errors.jenis_pembayaran}</FieldError>}
                                    </Field>

                                    {jenisPembayaran === 'Kredit' && (
                                        <Field>
                                            <FieldLabel htmlFor="tgl_jatuh_tempo">Tanggal Jatuh Tempo</FieldLabel>
                                            <Input
                                                id="tgl_jatuh_tempo"
                                                type="date"
                                                value={form.data.tgl_jatuh_tempo}
                                                onChange={e => form.setData('tgl_jatuh_tempo', e.target.value)}
                                            />
                                            {form.errors.tgl_jatuh_tempo && <FieldError>{form.errors.tgl_jatuh_tempo}</FieldError>}
                                        </Field>
                                    )}
                                </div>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* Detail Items */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Detail Bahan Baku</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="h-4 w-4 mr-1" /> Tambah Baris
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="pb-2 text-left font-medium">Bahan Baku</th>
                                            <th className="pb-2 text-left font-medium w-28">Qty</th>
                                            <th className="pb-2 text-left font-medium w-44">Harga Satuan (Rp)</th>
                                            <th className="pb-2 text-right font-medium w-40">Subtotal</th>
                                            <th className="pb-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="py-2 pr-2">
                                                    <Select
                                                        value={item.bahan_baku_id}
                                                        onValueChange={val => updateItem(index, 'bahan_baku_id', val)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Pilih bahan baku" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {bahanBakus.map(b => (
                                                                <SelectItem key={b.id} value={String(b.id)}>
                                                                    {b.nama_bahan} ({b.satuan})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {(form.errors as any)[`items.${index}.bahan_baku_id`] && (
                                                        <p className="text-xs text-destructive mt-1">{(form.errors as any)[`items.${index}.bahan_baku_id`]}</p>
                                                    )}
                                                </td>
                                                <td className="py-2 pr-2">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="0"
                                                        value={item.qty}
                                                        onChange={e => updateItem(index, 'qty', e.target.value)}
                                                    />
                                                </td>
                                                <td className="py-2 pr-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        value={item.harga_satuan}
                                                        onChange={e => updateItem(index, 'harga_satuan', e.target.value)}
                                                    />
                                                </td>
                                                <td className="py-2 pr-2 text-right font-medium">
                                                    {formatRupiah(calculateSubtotal(item))}
                                                </td>
                                                <td className="py-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeItem(index)}
                                                        disabled={items.length === 1}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t">
                                            <td colSpan={3} className="pt-3 pr-2 text-right font-semibold text-muted-foreground">Total Pembelian:</td>
                                            <td className="pt-3 text-right font-bold text-lg">{formatRupiah(calculateTotal())}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {(form.errors as any)['items'] && (
                                <p className="text-xs text-destructive mt-2">{(form.errors as any)['items']}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit(purchasesAction.index().url)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Menyimpan...' : 'Simpan Pembelian'}
                        </Button>
                    </div>

                </form>
            </div>
        </>
    );
}

PurchasesCreate.layout = {
    breadcrumbs: [
        { title: 'Transaksi Pembelian', href: purchasesAction.index() },
        { title: 'Tambah Pembelian', href: purchasesAction.create() },
    ],
};
