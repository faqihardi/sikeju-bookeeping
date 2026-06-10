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
        nama_bahan: string
        stok: number
        satuan: string
        harga_satuan: number
    }
}

export function BahanBakuForm({
    bahanBaku
}: Props) {

    const isEdit = !!bahanBaku

    const form = useForm({
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
        <form
            onSubmit={submit}
            className="space-y-4"
        >
            <FieldGroup>

                <Field>
                    <FieldLabel>
                        Nama Bahan
                    </FieldLabel>

                    <Input
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

                <Field>
                    <FieldLabel>
                        Stok
                    </FieldLabel>

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
                        {isEdit ? "Stok hanya bisa berubah lewat fitur Pembelian/Koreksi Stok." : "Masukkan stok awal/inisialisasi."}
                    </p>

                    {form.errors.stok && (
                        <FieldError>
                            {form.errors.stok}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel>
                        Satuan
                    </FieldLabel>

                    <Input
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
                    <FieldLabel>
                        Harga Satuan
                    </FieldLabel>

                    <Input
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

                <div className="flex gap-2">
                 <Button
                    type="button"
                    variant="outline"
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