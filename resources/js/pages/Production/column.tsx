"use client"

import { ColumnDef } from "@tanstack/react-table"
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUpDown } from 'lucide-react';
import * as productions from '@/actions/App/Http/Controllers/ProduksiController';
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type PemakaianBahan = {
  id: number
  bahan_baku_id: number
  qty_bahan_dipakai: number
  bahan_baku: {
    nama_bahan: string
    satuan: string
  }
}

export type Produksi = {
  id: number
  tanggal: string
  produk_id: number
  qty_hasil: number
  keterangan: string
  produk: {
    nama_produk: string
    satuan: string
  }
  pemakaian_bahans: PemakaianBahan[]
}

export const columns: ColumnDef<Produksi>[] = [
  {
    accessorKey: "tanggal",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Tanggal
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("tanggal"))
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    }
  },
  {
    id: "produk",
    header: "Produk Jadi",
    cell: ({ row }) => {
      const prod = row.original.produk;
      return prod ? `${prod.nama_produk}` : "-";
    }
  },
  {
    accessorKey: "qty_hasil",
    header: "Jumlah Hasil",
    cell: ({ row }) => {
      const qty = row.original.qty_hasil;
      const satuan = row.original.produk?.satuan ?? '';
      return `${qty} ${satuan}`;
    }
  },
  {
    id: "pemakaian_bahan",
    header: "Bahan Baku Terpakai",
    cell: ({ row }) => {
      const materials = row.original.pemakaian_bahans;
      if (!materials || materials.length === 0) return "-";
      return (
        <div className="flex flex-wrap gap-1 max-w-sm">
          {materials.map((m) => (
            <Badge key={m.id} variant="outline" className="text-xs">
              {m.bahan_baku?.nama_bahan ?? `Bahan #${m.bahan_baku_id}`}: {m.qty_bahan_dipakai} {m.bahan_baku?.satuan ?? ''}
            </Badge>
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
    cell: ({ row }) => row.getValue("keterangan") || "-"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Batalkan / Hapus Transaksi Produksi?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Kuantitas stok bahan baku yang terpakai akan dikembalikan ke gudang, dan kuantitas produk jadi hasil produksi ini akan dikurangi secara otomatis.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const action = productions.destroy(id);
                    router.visit(action.url, { method: 'delete' });
                  }}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  Hapus / Batalkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  },
]
