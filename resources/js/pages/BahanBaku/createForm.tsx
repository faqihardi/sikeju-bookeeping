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
import * as materials from "@/actions/App/Http/Controllers/BahanBakuController"

interface Props {
    bahanBaku?: {
        id: number
        kode: string
        nama_bahan: string
        stok: number
        satuan: string
        harga_satuan: number
    }
    defaultKode?: string
}

export function BahanBakuForm({
    bahanBaku,
    defaultKode
}: Props) {

    const isEdit = !!bahanBaku

    const form = useForm({
        kode: bahanBaku?.kode ?? defaultKode ?? "",
        nama_bahan: bahanBaku?.nama_bahan ?? "",
        stok: bahanBaku?.stok ?? "",
        satuan: bahanBaku?.satuan ?? "",
        harga_satuan: bahanBaku?.harga_satuan ?? "",
    })

    function submit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault()

        const action = isEdit
            ? materials.update(bahanBaku.id)
            : materials.store()

        form.submit(action.method, action.url, {
            onSuccess: () => {
                toast.success(
                    isEdit
                        ? "Data berhasil diperbarui"
                        : "Data berhasil disimpan"
                )

                if (!isEdit) {
                    form.reset()
                }
            },

            onError: () => {
                toast.error(
                    "Periksa kembali data"
                )
            }
        })
    }

    return (
        <form onSubmit={submit}>
            <FieldGroup className="max-w-2xl">
                <Field>
                    <FieldLabel htmlFor="kode">
                        Kode Bahan Baku
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
                    <FieldLabel htmlFor="nama_bahan">Nama Bahan</FieldLabel>
                    <Input
                        id="nama_bahan"
                        value={form.data.nama_bahan}
                        onChange={(e) =>
                            form.setData(
                                "nama_bahan",
                                e.target.value
                            )
                        }
                    />
                    {form.errors.nama_bahan && (
                        <FieldError>
                            {form.errors.nama_bahan}
                        </FieldError>
                    )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="satuan">Satuan</FieldLabel>
                        <Input
                            id="satuan"
                            placeholder="Contoh: Pcs, Kg, Liter"
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

                    <Field>
                        <FieldLabel htmlFor="harga_satuan">Harga Satuan</FieldLabel>
                        <Input
                            id="harga_satuan"
                            type="number"
                            value={form.data.harga_satuan}
                            onChange={(e) =>
                                form.setData(
                                    "harga_satuan",
                                    e.target.value
                                )
                            }
                        />
                        {form.errors.harga_satuan && (
                            <FieldError>
                                {form.errors.harga_satuan}
                            </FieldError>
                        )}
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="stok">Stok Fisik Awal</FieldLabel>
                    <Input
                        id="stok"
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
                        {isEdit ? "Stok hanya bisa berubah lewat fitur Pembelian/Koreksi Stok." : "Masukkan stok awal/inisialisasi."}
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
                        onClick={() => router.visit(materials.index().url)}
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
                        {form.processing
                            ? "Menyimpan..."
                            : isEdit
                                ? "Update"
                                : "Simpan"}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    )
}