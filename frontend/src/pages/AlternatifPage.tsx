import { FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDeleteDialog } from '@/components/modules/ConfirmDeleteDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/utils'
import { alternatifService } from '@/services/master-data-service'
import type { Alternatif } from '@/types'

const emptyForm = {
  nama: '',
  deskripsi: '',
  foto: null as File | null,
}

export function AlternatifPage() {
  const [items, setItems] = useState<Alternatif[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Alternatif | null>(null)
  const [form, setForm] = useState(emptyForm)

  const loadAlternatives = () => {
    setLoading(true)
    alternatifService
      .list()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(loadAlternatives, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const payload = new FormData()
      payload.append('nama', form.nama)
      payload.append('deskripsi', form.deskripsi)
      if (form.foto) {
        payload.append('foto', form.foto)
      }

      await (editing ? alternatifService.update(editing.id, payload) : alternatifService.create(payload))
      toast.success(editing ? 'Alternatif diperbarui.' : 'Alternatif ditambahkan.')
      setOpen(false)
      setEditing(null)
      setForm(emptyForm)
      loadAlternatives()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await alternatifService.remove(id)
      toast.success('Alternatif dihapus.')
      loadAlternatives()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Card className="rounded-[2rem]">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Manajemen Alternatif</CardTitle>
          <CardDescription>Kelola kandidat dengan deskripsi dan upload foto/dokumen opsional.</CardDescription>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null)
                setForm(emptyForm)
              }}
            >
              <Plus className="h-4 w-4" />
              Tambah Alternatif
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Alternatif' : 'Tambah Alternatif'}</DialogTitle>
              <DialogDescription>Unggah file pendukung bila diperlukan.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input value={form.nama} onChange={(e) => setForm((value) => ({ ...value, nama: e.target.value }))} placeholder="Nama alternatif" />
              <Textarea
                value={form.deskripsi}
                onChange={(e) => setForm((value) => ({ ...value, deskripsi: e.target.value }))}
                placeholder="Deskripsi"
              />
              <Input
                type="file"
                onChange={(e) => setForm((value) => ({ ...value, foto: e.target.files?.[0] ?? null }))}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              />
              <Button className="w-full" type="submit">
                Simpan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="rounded-3xl border p-6 text-sm text-muted-foreground">Memuat data...</div>
        ) : error ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">{error}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-3xl border bg-card p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.nama}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.deskripsi ?? '-'}</p>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {item.foto_url ? (
                    <a className="text-primary underline-offset-4 hover:underline" href={item.foto_url} rel="noreferrer" target="_blank">
                      Lihat file
                    </a>
                  ) : (
                    'Tidak ada lampiran'
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(item)
                      setForm({
                        nama: item.nama,
                        deskripsi: item.deskripsi ?? '',
                        foto: null,
                      })
                      setOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <ConfirmDeleteDialog
                    title="Hapus alternatif?"
                    description={`Alternatif ${item.nama} akan dihapus permanen.`}
                    onConfirm={() => handleDelete(item.id)}
                  >
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmDeleteDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
