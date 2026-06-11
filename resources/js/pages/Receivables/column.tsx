"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, BadgeCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type PembayaranPiutang = {
  id: number
  nominal_bayar: number
  tanggal: string
}

export type Piutang = {
  id: number
  nominal: number
  status: 'lunas' | 'belum_lunas'
  tgl_jatuh_tempo: string
  created_at: string
  penjualan: {
    id: number
    no_faktur: string
    pelanggan: { nama_pelanggan: string } | null
  } | null
  pembayaran_piutangs: PembayaranPiutang[]
}

export const columns: ColumnDef<Piutang>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Tanggal Transaksi
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    }
  },
  {
    id: "no_faktur",
    header: "No. Faktur",
    cell: ({ row }) => row.original.penjualan?.no_faktur ?? "-"
  },
  {
    id: "pelanggan",
    header: "Pelanggan",
    cell: ({ row }) => row.original.penjualan?.pelanggan?.nama_pelanggan ?? "-"
  },
  {
    accessorKey: "nominal",
    header: "Total Piutang",
    cell: ({ row }) => formatRupiah(row.getValue("nominal"))
  },
  {
    id: "sudah_dibayar",
    header: "Sudah Diterima",
    cell: ({ row }) => {
      const total = row.original.pembayaran_piutangs.reduce((sum, p) => sum + Number(p.nominal_bayar), 0)
      return formatRupiah(total)
    }
  },
  {
    id: "sisa",
    header: "Sisa Tagihan",
    cell: ({ row }) => {
      const total = row.original.pembayaran_piutangs.reduce((sum, p) => sum + Number(p.nominal_bayar), 0)
      const sisa = Number(row.original.nominal) - total
      return (
        <span className={sisa > 0 ? "font-semibold text-red-600 dark:text-red-400" : "font-semibold text-green-600 dark:text-green-400"}>
          {formatRupiah(sisa)}
        </span>
      )
    }
  },
  {
    accessorKey: "tgl_jatuh_tempo",
    header: "Jatuh Tempo",
    cell: ({ row }) => {
      const date = new Date(row.getValue("tgl_jatuh_tempo"))
      const isOverdue = row.original.status === 'belum_lunas' && date < new Date()
      return (
        <span className={isOverdue ? "text-red-600 dark:text-red-400 font-medium animate-pulse" : ""}>
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
