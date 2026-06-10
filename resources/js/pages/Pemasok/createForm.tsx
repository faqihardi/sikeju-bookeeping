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
import { Textarea } from "@/components/ui/textarea"
import * as suppliers from "@/actions/App/Http/Controllers/PemasokController"

interface Props {
    pemasok?: {
        id: number
        nama_pemasok: string
        no_telepon: string | null
        alamat: string | null
        keterangan: string | null
    }
}

export function PemasokForm({
    pemasok
}: Props) {

    const isEdit = !!pemasok

    const form = useForm({
        nama_pemasok: pemasok?.nama_pemasok ?? "",
        no_telepon: pemasok?.no_telepon ?? "",
        alamat: pemasok?.alamat ?? "",
        keterangan: pemasok?.keterangan ?? "",
    })

    function submit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault()

        const action = isEdit
            ? suppliers.update(pemasok.id)
            : suppliers.store()

        form.submit(action.method, action.url, {
            onSuccess: () => {
                // Success message handled by index component
            },

            onError: () => {
                toast.error(
                    "Terdapat kesalahan pada form. Silakan periksa kembali."
                )
            }
        })
    }

    return (
        <form onSubmit={submit}>
            <FieldGroup className="max-w-2xl">
                <Field>
                    <FieldLabel htmlFor="nama_pemasok">
                        Nama Pemasok
                    </FieldLabel>

                    <Input
                        id="nama_pemasok"
                        value={form.data.nama_pemasok}
                        onChange={(e) =>
                            form.setData(
                                "nama_pemasok",
                                e.target.value
                            )
                        }
                    />

                    {form.errors.nama_pemasok && (
                        <FieldError>
                            {form.errors.nama_pemasok}
                        </FieldError>
                    )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="no_telepon">
                            No. Telepon
                        </FieldLabel>

                        <Input
                            id="no_telepon"
                            placeholder="Contoh: 08123456789"
                            value={form.data.no_telepon}
                            onChange={(e) =>
                                form.setData(
                                    "no_telepon",
                                    e.target.value
                                )
                            }
                        />

                        {form.errors.no_telepon && (
                            <FieldError>
                                {form.errors.no_telepon}
                            </FieldError>
                        )}
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="alamat">
                        Alamat
                    </FieldLabel>

                    <Textarea
                        id="alamat"
                        placeholder="Alamat lengkap pemasok..."
                        value={form.data.alamat}
                        onChange={(e) =>
                            form.setData(
                                "alamat",
                                e.target.value
                            )
                        }
                    />

                    {form.errors.alamat && (
                        <FieldError>
                            {form.errors.alamat}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="keterangan">
                        Keterangan
                    </FieldLabel>

                    <Textarea
                        id="keterangan"
                        placeholder="Keterangan tambahan (opsional)..."
                        value={form.data.keterangan}
                        onChange={(e) =>
                            form.setData(
                                "keterangan",
                                e.target.value
                            )
                        }
                    />

                    {form.errors.keterangan && (
                        <FieldError>
                            {form.errors.keterangan}
                        </FieldError>
                    )}
                </Field>

                <div className="flex gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit(suppliers.index().url)}
                    >
                        Batal
                    </Button>
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
