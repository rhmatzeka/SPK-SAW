import { Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/utils'
import { nilaiService } from '@/services/master-data-service'
import type { MatrixPayload } from '@/types'

export function NilaiPage() {
  const [data, setData] = useState<MatrixPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    nilaiService
      .getMatrix()
      .then((response) => {
        setData(response)
        setDrafts(
          response.alternatives.reduce<Record<string, string>>((acc, alternative) => {
            response.criteria.forEach((criterion) => {
              const value = alternative.nilai[criterion.id]?.nilai
              acc[`${alternative.id}-${criterion.id}`] = value !== undefined ? String(value) : ''
            })
            return acc
          }, {}),
        )
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const completion = useMemo(() => {
    if (!data) {
      return { filled: 0, total: 0 }
    }

    const total = data.criteria.length * data.alternatives.length
    const filled = Object.values(drafts).filter((value) => value !== '').length
    return { filled, total }
  }, [data, drafts])

  const handleSave = async () => {
    if (!data) {
      return
    }

    setSaving(true)

    try {
      const items = data.alternatives.flatMap((alternative) =>
        data.criteria.map((criterion) => ({
          alternatif_id: alternative.id,
          kriteria_id: criterion.id,
          nilai: Number(drafts[`${alternative.id}-${criterion.id}`] ?? 0),
        })),
      )

      await nilaiService.saveMatrix(items)
      toast.success('Matriks keputusan berhasil disimpan.')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Input Nilai Matriks Keputusan</CardTitle>
          <CardDescription>Masukkan nilai tiap alternatif terhadap tiap kriteria pada rentang yang diizinkan.</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={completion.filled === completion.total ? 'success' : 'warning'}>
            {completion.filled}/{completion.total} sel terisi
          </Badge>
          <Button disabled={saving || loading} onClick={handleSave}>
            <Save className="h-4 w-4" />
            {saving ? 'Menyimpan...' : 'Simpan Nilai'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-80 w-full" />
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">{error}</div>
        ) : !data ? (
          <div className="rounded-lg border p-4 text-muted-foreground">Data matriks belum tersedia.</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
              Rentang nilai: {data.range.min} sampai {data.range.max}
            </div>

            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-3 text-left">Alternatif</th>
                    {data.criteria.map((criterion) => (
                      <th key={criterion.id} className="px-4 py-3 text-left">
                        <div>{criterion.nama}</div>
                        <div className="text-xs font-normal text-muted-foreground">{criterion.jenis}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.alternatives.map((alternative) => (
                    <tr key={alternative.id} className="border-t align-top">
                      <td className="px-4 py-3 font-medium">
                        <div>{alternative.nama}</div>
                        <div className="text-xs text-muted-foreground">{alternative.deskripsi ?? '-'}</div>
                      </td>
                      {data.criteria.map((criterion) => {
                        const key = `${alternative.id}-${criterion.id}`

                        return (
                          <td key={criterion.id} className="px-4 py-3">
                            <Input
                              type="number"
                              min={data.range.min}
                              max={data.range.max}
                              step="0.0001"
                              value={drafts[key] ?? ''}
                              onChange={(event) =>
                                setDrafts((current) => ({
                                  ...current,
                                  [key]: event.target.value,
                                }))
                              }
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
