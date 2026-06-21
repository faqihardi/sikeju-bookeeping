"use client"

import { ColumnDef } from "@tanstack/react-table"
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUpDown, BadgeCheck, Clock, Eye } from 'lucide-react';
import * as sales from '@/actions/App/Http/Controllers/PenjualanController';
import { formatRupiah } from "@/lib/utils";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type Penjualan = {
  id: number
  no_faktur: string
  total: number
  created_at: string
  pelanggan: { nama_pelanggan: string } | null
  piutang: { status: 'lunas' | 'belum_lunas' } | null
  detail_penjualans: { 
    qty: number;
    produk?: { nama_produk: string; satuan: string }
  }[]
}

export const columns: ColumnDef<Penjualan>[] = [
  {
    accessorKey: "created_at",
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
      const date = new Date(row.getValue("created_at"))
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    }
  },
  {
    accessorKey: "no_faktur",
    header: "No. Faktur",
  },
  {
    id: "pelanggan",
    header: "Pelanggan",
    cell: ({ row }) => row.original.pelanggan?.nama_pelanggan ?? "-"
  },
  {
    id: "items",
    header: "Produk Terjual",
    cell: ({ row }) => {
      const items = row.original.detail_penjualans || [];
      const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
      if (items.length === 0) return "-";
      
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
              <Eye className="mr-2 h-3 w-3" />
              {items.length} Varian ({totalQty} Item)
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detail Produk Terjual</DialogTitle>
              <DialogDescription>
                Rincian produk jadi pada faktur {row.original.no_faktur}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 mt-2 max-h-[60vh] overflow-y-auto pr-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2 text-sm">
                  <span className="font-medium">{item.produk?.nama_produk ?? 'Produk'}</span>
                  <Badge variant="secondary" className="font-bold">{item.qty} {item.produk?.satuan ?? ''}</Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatRupiah(row.getValue("total"))
  },
  {
    id: "jenis",
    header: "Jenis Pembayaran",
    cell: ({ row }) => {
      const piutang = row.original.piutang;
      if (piutang === null) {
        return <Badge variant="secondary">Tunai</Badge>
      }
      if (piutang.status === 'lunas') {
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1">
            <BadgeCheck className="h-3 w-3" /> Kredit (Lunas)
          </Badge>
        )
      }
      return (
        <Badge variant="destructive" className="gap-1">
          <Clock className="h-3 w-3" /> Kredit (Berjalan)
        </Badge>
      )
    }
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
                <AlertDialogTitle>Hapus Transaksi Penjualan?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Kuantitas stok produk yang berkurang dari penjualan ini akan dikembalikan, dan catatan kas atau piutang yang terkait akan dihapus secara otomatis.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const action = sales.destroy(id);
                    router.visit(action.url, { method: 'delete' });
                  }}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  },
]
