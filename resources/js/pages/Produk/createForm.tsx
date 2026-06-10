import { useForm } from "@inertiajs/react"
import { router } from "@inertiajs/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import * as products from "@/actions/App/Http/Controllers/ProdukController"

interface Props {
    product?: {
        id: number
        kode: string
        nama_produk: string
        stok: number
        hpp: number
        harga_jual: number
        satuan: string
    }
    defaultKode?: string
}

export function ProdukForm({
    product,
    defaultKode
}: Props) {

    const isEdit = !!product

    const form = useForm({
        kode: product?.kode ?? defaultKode ?? "",
        nama_produk: product?.nama_produk ?? "",
        stok: product?.stok ?? "",
        hpp: product?.hpp ?? "",
        harga_jual: product?.harga_jual ?? "",
        satuan: product?.satuan ?? "",
    })

    function submit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault()

        const action = isEdit
            ? products.update(product.id)
            : products.store()

        form.submit(action.method, action.url, {
            onSuccess: () => {
                // Success is handled by Index flash message
            },
            onError: (errors) => {
                toast.error("Terdapat kesalahan pada form. Silakan periksa kembali.")
            }
        })
    }

    return (
        <form onSubmit={submit}>
            <FieldGroup className="max-w-2xl">
                <Field>
                    <FieldLabel htmlFor="kode">
                        Kode Produk
                    </FieldLabel>

                    <Input
                        id="kode"
                        value={form.data.kode}
                        onChange={(e) =>
                            form.setData(
                                "kode",
                                e.target.value
                            )
                        }
                    />

                    {form.errors.kode && (
                        <FieldError>
                            {form.errors.kode}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="nama_produk">Nama Produk</FieldLabel>
                    <Input
                        id="nama_produk"
                        value={form.data.nama_produk}
                        onChange={(e) =>
                            form.setData(
                                "nama_produk",
                                e.target.value
                            )
                        }
                    />
                    {form.errors.nama_produk && (
                        <FieldError>
                            {form.errors.nama_produk}
                        </FieldError>
                    )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="satuan">Satuan</FieldLabel>
                        <Input
                            id="satuan"
                            placeholder="Contoh: Pcs, Box, Kg"
                            value={form.data.satuan}
                            onChange={(e) =>
                                form.setData(
                                    "satuan",
                                    e.target.value
                                )
                            }
                        />
                        {form.errors.satuan && (
                            <FieldError>
                                {form.errors.satuan}
                            </FieldError>
                        )}
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="hpp">HPP (Harga Pokok Penjualan)</FieldLabel>
                        <Input
                            id="hpp"
                            type="number"
                            value={form.data.hpp}
                            onChange={(e) =>
                                form.setData(
                                    "hpp",
                                    e.target.value
                                )
                            }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Biaya modal untuk memproduksi 1 satuan produk.
                        </p>
                        {form.errors.hpp && (
                            <FieldError>
                                {form.errors.hpp}
                            </FieldError>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="harga_jual">Harga Jual</FieldLabel>
                        <Input
                            id="harga_jual"
                            type="number"
                            value={form.data.harga_jual}
                            onChange={(e) =>
                                form.setData(
                                    "harga_jual",
                                    e.target.value
                                )
                            }
                        />
                        {form.errors.harga_jual && (
                            <FieldError>
                                {form.errors.harga_jual}
                            </FieldError>
                        )}
                    </Field>
                </div>

                <Field>
                    <FieldLabel>Stok Fisik Awal</FieldLabel>
                    <Input
                        type="number"
                        value={form.data.stok}
                        disabled={isEdit}
                        onChange={(e) =>
                            form.setData(
                                "stok",
                                e.target.value
                            )
                        }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {isEdit ? "Stok produk hanya bisa berubah lewat fitur Produksi, Penjualan, atau Koreksi Stok." : "Masukkan stok produk yang sudah jadi/tersedia saat ini."}
                    </p>

                    {form.errors.stok && (
                        <FieldError>
                            {form.errors.stok}
                        </FieldError>
                    )}
                </Field>

                <div className="flex gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit(products.index().url)}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => form.reset()}
                        disabled={form.processing}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        disabled={form.processing}
                    >
                        Simpan
                    </Button>
                </div>
            </FieldGroup>
        </form>
    )
}
