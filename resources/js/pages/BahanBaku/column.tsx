"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import * as materials from '@/actions/App/Http/Controllers/BahanBakuController';

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
    header: "Nama Bahan",
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
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => {
              if (confirm("Yakin ingin menghapus data ini?")) {
                const action = materials.destroy(id);
                router.visit(action.url, { method: 'delete' });
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  },
]