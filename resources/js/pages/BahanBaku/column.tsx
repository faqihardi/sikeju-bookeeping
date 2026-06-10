"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import * as materials from '@/actions/App/Http/Controllers/BahanBakuController';
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

export type BahanBaku = {
  id: number
  nama_bahan: string
  stok: number
  satuan: string
  harga_satuan: number
  updated_at: string
}

export const columns: ColumnDef<BahanBaku>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nama_bahan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Nama Bahan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "stok",
    header: "Stok",
  },
  {
    accessorKey: "satuan",
    header: "Satuan",
  },
  {
    accessorKey: "harga_satuan",
    header: "Harga Satuan",
  },
  {
    accessorKey: "updated_at",
    header: "Tanggal Update",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updated_at"))
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex items-center gap-2">
          <Link href={materials.edit(id).url}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Bahan Baku?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Data bahan baku ini akan dihapus permanen dari sistem.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => {
                    const action = materials.destroy(id);
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