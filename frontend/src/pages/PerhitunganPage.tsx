import { Download, Play, RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { RankingChart } from '@/components/modules/RankingChart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatNumber, getErrorMessage } from '@/lib/utils'
import { perhitunganService } from '@/services/master-data-service'
import type { Perhitungan, SawMatrixRow } from '@/types'

function MatrixTable({
  title,
  rows,
  isNormalized = false,
}: {
  title: string
  rows: SawMatrixRow[]
  isNormalized?: boolean
}) {
  const criteria = rows[0]?.values ?? []

  if (!rows.length) {
    return null
  }

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left">Alternatif</th>
              {criteria.map((criterion) => (
                <th key={criterion.kriteria_id} className="px-4 py-3 text-left">
                  {criterion.kriteria_nama}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.alternatif_id} className="border-t">
                <td className="px-4 py-3 font-medium">{row.alternatif_nama}</td>
                {row.values.map((value) => (
                  <td key={value.kriteria_id} className="px-4 py-3">
                    {formatNumber(isNormalized ? value.nilai_normalisasi ?? 0 : value.nilai, isNormalized ? 6 : 4)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export function PerhitunganPage() {
  const [items, setItems] = useState<Perhitungan[]>([])
  const [selected, setSelected] = useState<Perhitungan | null>(null)
  const [sessionName, setSessionName] = useState('Sesi Perhitungan Baru')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const loadCalculations = async () => {
    setLoading(true)

    try {
      const [history, latest] = await Promise.all([perhitunganService.list(), perhitunganService.latest()])
      setItems(history)
      setSelected(latest ?? history[0] ?? null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCalculations()
  }, [])

  const ranking = useMemo(() => selected?.hasil?.step_4_ranking ?? [], [selected])

  const handleProcess = async () => {
    setProcessing(true)

    try {
      const result = await perhitunganService.process(sessionName)
      toast.success('Perhitungan SAW selesai dijalankan.')
      setSelected(result)
      setSessionName(`Sesi ${new Date().toLocaleString('id-ID')}`)
      await loadCalculations()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setProcessing(false)
    }
  }

  const handleExport = async (type: 'pdf' | 'excel') => {
    if (!selected) {
      return
    }

    try {
      await perhitunganService.downloadExport(selected.id, type)
      toast.success(`Export ${type.toUpperCase()} berhasil diunduh.`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Proses Perhitungan SAW</CardTitle>
            <CardDescription>Jalankan algoritma SAW langkah demi langkah dan simpan ke history.</CardDescription>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input value={sessionName} onChange={(event) => setSessionName(event.target.value)} placeholder="Nama sesi perhitungan" />
            <Button disabled={processing} onClick={handleProcess}>
              <Play className="h-4 w-4" />
              {processing ? 'Memproses...' : 'Jalankan SAW'}
            </Button>
            <Button variant="outline" onClick={() => void loadCalculations()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : error ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">{error}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Riwayat Perhitungan</CardTitle>
              <CardDescription>Pilih sesi untuk melihat detail langkah SAW.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 ? (
                <div className="rounded-2xl border p-4 text-sm text-muted-foreground">Belum ada history perhitungan.</div>
              ) : (
                items.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      selected?.id === item.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelected(item)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.nama_sesi}</p>
                      <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{formatDate(item.created_at)}</p>
                    <p className="mt-2 text-sm">
                      Rank #1:{' '}
                      <span className="font-semibold">
                        {item.hasil?.ringkasan?.alternatif_terbaik?.alternatif_nama ?? '-'}
                      </span>
                    </p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {selected ? (
              <>
                <Card className="rounded-[2rem]">
                  <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>{selected.nama_sesi}</CardTitle>
                      <CardDescription>
                        Dibuat {formatDate(selected.created_at)} oleh {selected.user?.name ?? 'pengguna'}.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => void handleExport('pdf')}>
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button variant="outline" onClick={() => void handleExport('excel')}>
                        <Download className="h-4 w-4" />
                        Excel
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      {ranking.map((item) => (
                        <div
                          key={item.alternatif_id}
                          className={`rounded-3xl border p-4 ${item.ranking === 1 ? 'bg-primary/10 border-primary/30' : ''}`}
                        >
                          <p className="text-sm text-muted-foreground">Ranking #{item.ranking}</p>
                          <p className="mt-2 font-semibold">{item.alternatif_nama}</p>
                          <p className="mt-1 text-sm">Skor {formatNumber(item.skor, 6)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <RankingChart data={ranking} />
                <MatrixTable rows={selected.hasil.step_1_matriks_keputusan} title="Step 1: Matriks Keputusan X" />
                <MatrixTable rows={selected.hasil.step_2_normalisasi} title="Step 2: Matriks Normalisasi R" isNormalized />
              </>
            ) : (
              <Card className="rounded-[2rem]">
                <CardContent className="p-6 text-muted-foreground">Pilih history atau jalankan proses baru untuk melihat hasil.</CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
