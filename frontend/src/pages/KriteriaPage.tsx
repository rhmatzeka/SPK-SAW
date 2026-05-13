import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDeleteDialog } from '@/components/modules/ConfirmDeleteDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatNumber, getErrorMessage } from '@/lib/utils'
import { criteriaService } from '@/services/master-data-service'
import type { CriterionType, Kriteria, WeightSummary } from '@/types'

const emptyForm = {
  nama: '',
  bobot: '0.0000',
  jenis: 'benefit' as CriterionType,
  keterangan: '',
}

export function KriteriaPage() {
  const [items, setItems] = useState<Kriteria[]>([])
  const [summary, setSummary] = useState<WeightSummary | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Kriteria | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCriteria = () => {
    setLoading(true)
    criteriaService
      .list()
      .then((response) => {
        setItems(response.items)
        setSummary(response.summary)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(loadCriteria, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const payload = {
        nama: form.nama,
        bobot: Number(form.bobot),
        jenis: form.jenis,
        keterangan: form.keterangan,
      }

      const response = editing
        ? await criteriaService.update(editing.id, payload)
        : await criteriaService.create(payload)

      setItems((current) => {
        if (editing) {
          return current.map((item) => (item.id === editing.id ? response.item : item))
        }
        return [...current, response.item]
      })
      setSummary(response.summary)
      setOpen(false)
      setEditing(null)
      setForm(emptyForm)
      toast.success(editing ? 'Kriteria diperbarui.' : 'Kriteria ditambahkan.')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await criteriaService.remove(id)
      setItems((current) => current.filter((item) => item.id !== id))
      setSummary(response.summary)
      toast.success('Kriteria dihapus.')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-xl">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Manajemen Kriteria</CardTitle>
            <CardDescription>Kelola bobot benefit/cost. Perhitungan SAW aktif saat total bobot = 1.0000.</CardDescription>
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
                Tambah Kriteria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Kriteria' : 'Tambah Kriteria'}</DialogTitle>
                <DialogDescription>Pastikan bobot mengikuti total 1.0000.</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input value={form.nama} onChange={(e) => setForm((value) => ({ ...value, nama: e.target.value }))} placeholder="Nama kriteria" />
                <Input
                  value={form.bobot}
                  type="number"
                  step="0.0001"
                  min="0"
                  max="1"
                  onChange={(e) => setForm((value) => ({ ...value, bobot: e.target.value }))}
                  placeholder="Bobot"
                />
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={form.jenis}
                  onChange={(e) => setForm((value) => ({ ...value, jenis: e.target.value as CriterionType }))}
                >
                  <option value="benefit">Benefit</option>
                  <option value="cost">Cost</option>
                </select>
                <Textarea
                  value={form.keterangan}
                  onChange={(e) => setForm((value) => ({ ...value, keterangan: e.target.value }))}
                  placeholder="Keterangan"
                />
                <Button className="w-full" type="submit">
                  Simpan
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {summary ? (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border bg-muted/50 p-4">
              <Badge variant={summary.is_valid ? 'success' : 'warning'}>
                Total Bobot {formatNumber(summary.total_bobot)} / {formatNumber(summary.target)}
              </Badge>
              {!summary.is_valid ? <span className="text-sm text-muted-foreground">Sesuaikan bobot sampai tepat 1.0000.</span> : null}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">Memuat data...</div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Bobot</th>
                    <th className="px-4 py-3">Jenis</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{item.nama}</td>
                      <td className="px-4 py-3">{formatNumber(Number(item.bobot))}</td>
                      <td className="px-4 py-3">
                        <Badge variant={item.jenis === 'benefit' ? 'success' : 'warning'}>{item.jenis}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.keterangan ?? '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditing(item)
                              setForm({
                                nama: item.nama,
                                bobot: Number(item.bobot).toFixed(4),
                                jenis: item.jenis,
                                keterangan: item.keterangan ?? '',
                              })
                              setOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <ConfirmDeleteDialog
                            title="Hapus kriteria?"
                            description={`Kriteria ${item.nama} akan dihapus.`}
                            onConfirm={() => handleDelete(item.id)}
                          >
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ConfirmDeleteDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
