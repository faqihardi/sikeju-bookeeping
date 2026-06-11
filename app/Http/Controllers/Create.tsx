import React from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
// Asumsikan menggunakan ui components dari shadcn 
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

export default function Create({ pemasoks, bahanBakus, metodePembayarans }: any) {
    const { data, setData, post, processing, errors } = useForm({
        pemasok_id: '',
        metode_pembayaran_id: '',
        nama_pembelian: '',
        jenis_pembayaran: 'Tunai',
        tgl_jatuh_tempo: '',
        items: [{ bahan_baku_id: '', qty: 1, harga_satuan: 0 }]
    });

    const handleAddItem = () => {
        setData('items', [...data.items, { bahan_baku_id: '', qty: 1, harga_satuan: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items] as any;
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('purchases.store'), {
            onSuccess: () => {
                // toast.success('Pembelian berhasil ditambahkan!');
            }
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tambah Pembelian Baru</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Nama Pembelian</label>
                        <input 
                            className="border p-2 w-full rounded"
                            value={data.nama_pembelian} 
                            onChange={(e) => setData('nama_pembelian', e.target.value)} 
                            placeholder="Misal: Restock Tepung Minggu 1"
                        />
                        {errors.nama_pembelian && <div className="text-red-500">{errors.nama_pembelian}</div>}
                    </div>
                    <div>
                        <label className="block mb-2">Jenis Pembayaran</label>
                        <select 
                            className="border p-2 w-full rounded"
                            value={data.jenis_pembayaran} 
                            onChange={(e) => setData('jenis_pembayaran', e.target.value as 'Tunai' | 'Kredit')}
                        >
                            <option value="Tunai">Tunai</option>
                            <option value="Kredit">Kredit</option>
                        </select>
                    </div>
                    {data.jenis_pembayaran === 'Kredit' && (
                        <div>
                            <label className="block mb-2">Tanggal Jatuh Tempo</label>
                            <input 
                                type="date"
                                className="border p-2 w-full rounded"
                                value={data.tgl_jatuh_tempo} 
                                onChange={(e) => setData('tgl_jatuh_tempo', e.target.value)} 
                            />
                        </div>
                    )}
                </div>

                {/* Items Section */}
                <div className="border p-4 rounded bg-gray-50">
                    <h2 className="text-lg font-semibold mb-4">Detail Item Bahan Baku</h2>
                    {data.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center mb-4">
                            <input 
                                type="number" 
                                placeholder="Bahan Baku ID (Sementara)" 
                                value={item.bahan_baku_id} 
                                onChange={(e) => handleItemChange(index, 'bahan_baku_id', e.target.value)} 
                                className="border p-2 rounded"
                            />
                            <input type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} className="border p-2 rounded w-24" placeholder="Qty" />
                            <input type="number" value={item.harga_satuan} onChange={(e) => handleItemChange(index, 'harga_satuan', e.target.value)} className="border p-2 rounded" placeholder="Harga Satuan" />
                            <div className="w-32">Subtotal: Rp {item.qty * item.harga_satuan}</div>
                            <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} className="flex items-center gap-2 text-blue-600 font-semibold mt-2">
                        <Plus size={20} /> Tambah Item
                    </button>
                </div>

                <button type="submit" disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50">
                    Simpan Transaksi
                </button>
            </form>
        </div>
    );
}