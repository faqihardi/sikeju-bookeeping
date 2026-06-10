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
import * as customers from "@/actions/App/Http/Controllers/PelangganController"

interface Props {
    pelanggan?: {
        id: number
        nama_pelanggan: string
        no_telepon: string | null
    }
}

export function PelangganForm({
    pelanggan
}: Props) {

    const isEdit = !!pelanggan

    const form = useForm({
        nama_pelanggan: pelanggan?.nama_pelanggan ?? "",
        no_telepon: pelanggan?.no_telepon ?? "",
    })

    function submit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault()

        const action = isEdit
            ? customers.update(pelanggan.id)
            : customers.store()

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
                    <FieldLabel htmlFor="nama_pelanggan">
                        Nama Pelanggan
                    </FieldLabel>

                    <Input
                        id="nama_pelanggan"
                        value={form.data.nama_pelanggan}
                        onChange={(e) =>
                            form.setData(
                                "nama_pelanggan",
                                e.target.value
                            )
                        }
                    />

                    {form.errors.nama_pelanggan && (
                        <FieldError>
                            {form.errors.nama_pelanggan}
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

                <div className="flex gap-4 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit(customers.index().url)}
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
