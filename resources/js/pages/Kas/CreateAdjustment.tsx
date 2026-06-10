import * as React from "react"
import { useForm } from "@inertiajs/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import * as cashAction from "@/actions/App/Http/Controllers/KasController"

export function CreateAdjustment() {
    const [open, setOpen] = React.useState(false)

    const form = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        tipe_penyesuaian: "masuk" as "masuk" | "keluar",
        nominal: "",
        keterangan: "",
    })

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const action = cashAction.store()

        form.submit(action.method, action.url, {
            onSuccess: () => {
                setOpen(false)
                form.reset()
                toast.success("Penyesuaian kas berhasil disimpan.")
            },
            onError: () => {
                toast.error("Terdapat kesalahan pada form. Silakan periksa kembali.")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Catat Penyesuaian Kas
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Catat Penyesuaian Kas Manual</DialogTitle>
                        <DialogDescription>
                            Gunakan form ini untuk mencatat transaksi kas manual non-sistem (selain setoran modal, operasional, pembelian, atau penjualan).
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="tanggal">Tanggal</FieldLabel>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={form.data.tanggal}
                                    onChange={(e) => form.setData("tanggal", e.target.value)}
                                />
                                {form.errors.tanggal && <FieldError>{form.errors.tanggal}</FieldError>}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="tipe_penyesuaian">Jenis Aliran</FieldLabel>
                                <Select
                                    value={form.data.tipe_penyesuaian}
                                    onValueChange={(val) => form.setData("tipe_penyesuaian", val as "masuk" | "keluar")}
                                >
                                    <SelectTrigger id="tipe_penyesuaian">
                                        <SelectValue placeholder="Pilih jenis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="masuk">Uang Masuk (+)</SelectItem>
                                        <SelectItem value="keluar">Uang Keluar (-)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.tipe_penyesuaian && <FieldError>{form.errors.tipe_penyesuaian}</FieldError>}
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor="nominal">Nominal (Rupiah)</FieldLabel>
                            <Input
                                id="nominal"
                                type="number"
                                placeholder="Contoh: 150000"
                                value={form.data.nominal}
                                onChange={(e) => form.setData("nominal", e.target.value)}
                            />
                            {form.errors.nominal && <FieldError>{form.errors.nominal}</FieldError>}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="keterangan">Keterangan / Alasan</FieldLabel>
                            <Textarea
                                id="keterangan"
                                placeholder="Contoh: Selisih perhitungan kas fisik di laci"
                                value={form.data.keterangan}
                                onChange={(e) => form.setData("keterangan", e.target.value)}
                                rows={3}
                            />
                            {form.errors.keterangan && <FieldError>{form.errors.keterangan}</FieldError>}
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? "Menyimpan..." : "Simpan Penyesuaian"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
