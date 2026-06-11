"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, BadgeCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type PembayaranHutang = {
  id: number
  nominal_bayar: number
  tanggal: string
}

export type Hutang = {
  id: number
  nominal: number
  status: 'lunas' | 'belum_lunas'
  tgl_jatuh_tempo: string
  keterangan: string | null
  created_at: string
  pembelian: {
    id: number
    nama_pembelian: string
    pemasok: { nama_pemasok: string } | null
  } | null
  pembayaran_hutangs: PembayaranHutang[]
}

export const columns: ColumnDef<Hutang>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Tanggal Hutang
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    }
  },
  {
    id: "pemasok",
    header: "Pemasok",
    cell: ({ row }) => row.original.pembelian?.pemasok?.nama_pemasok ?? "-"
  },
  {
    id: "sumber",
    header: "Sumber Hutang",
    cell: ({ row }) => row.original.pembelian?.nama_pembelian ?? row.original.keterangan ?? "-"
  },
  {
    accessorKey: "nominal",
    header: "Total Hutang",
    cell: ({ row }) => formatRupiah(row.getValue("nominal"))
  },
  {
    id: "sudah_dibayar",
    header: "Sudah Dibayar",
    cell: ({ row }) => {
      const total = row.original.pembayaran_hutangs.reduce((sum, p) => sum + Number(p.nominal_bayar), 0)
      return formatRupiah(total)
    }
  },
  {
    id: "sisa",
    header: "Sisa Hutang",
    cell: ({ row }) => {
      const total = row.original.pembayaran_hutangs.reduce((sum, p) => sum + Number(p.nominal_bayar), 0)
      const sisa = Number(row.original.nominal) - total
      return <span className={sisa > 0 ? "font-semibold text-red-600 dark:text-red-400" : "font-semibold text-green-600 dark:text-green-400"}>{formatRupiah(sisa)}</span>
    }
  },
  {
    accessorKey: "tgl_jatuh_tempo",
    header: "Jatuh Tempo",
    cell: ({ row }) => {
      const date = new Date(row.getValue("tgl_jatuh_tempo"))
      const isOverdue = row.original.status === 'belum_lunas' && date < new Date()
      return (
        <span className={isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""}>
          {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      if (status === 'lunas') {
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1">
            <BadgeCheck className="h-3 w-3" /> Lunas
          </Badge>
        )
      }
      return (
        <Badge variant="destructive" className="gap-1">
          <Clock className="h-3 w-3" /> Belum Lunas
        </Badge>
      )
    }
  },
]
