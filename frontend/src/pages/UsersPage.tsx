import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDeleteDialog } from '@/components/modules/ConfirmDeleteDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/utils'
import { usersService } from '@/services/master-data-service'
import type { Role, User } from '@/types'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'user' as Role,
}

export function UsersPage() {
  const [items, setItems] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadUsers = () => {
    setLoading(true)
    usersService
      .list()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(loadUsers, [])

  const resetForm = () => {
    setEditing(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    try {
      if (editing) {
        await usersService.update(editing.id, form)
        toast.success('User berhasil diperbarui.')
      } else {
        await usersService.create(form)
        toast.success('User berhasil ditambahkan.')
      }

      setOpen(false)
      resetForm()
      loadUsers()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await usersService.remove(id)
      toast.success('User berhasil dihapus.')
      loadUsers()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Manajemen User</CardTitle>
          <CardDescription>CRUD akun admin dan user biasa.</CardDescription>
        </div>

        <Dialog open={open} onOpenChange={(value) => {
          setOpen(value)
          if (!value) {
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit User' : 'Tambah User'}</DialogTitle>
              <DialogDescription>Lengkapi data akun dan role akses pengguna.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input placeholder="Nama" value={form.name} onChange={(e) => setForm((value) => ({ ...value, name: e.target.value }))} />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((value) => ({ ...value, email: e.target.value }))}
              />
              <Input
                placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Password'}
                type="password"
                value={form.password}
                onChange={(e) => setForm((value) => ({ ...value, password: e.target.value }))}
              />
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.role}
                onChange={(e) => setForm((value) => ({ ...value, role: e.target.value as Role }))}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <Button className="w-full" disabled={saving} type="submit">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3 uppercase">{item.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditing(item)
                            setForm({
                              name: item.name,
                              email: item.email,
                              password: '',
                              role: item.role,
                            })
                            setOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <ConfirmDeleteDialog
                          title="Hapus user?"
                          description={`Akun ${item.name} akan dihapus permanen.`}
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
  )
}
