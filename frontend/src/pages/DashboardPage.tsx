import { Activity, ClipboardCheck, Layers3, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

import { RankingChart } from '@/components/modules/RankingChart'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatNumber, getErrorMessage } from '@/lib/utils'
import { dashboardService } from '@/services/master-data-service'
import type { DashboardData } from '@/types'

const statConfig = [
  { key: 'jumlah_kriteria', label: 'Kriteria', icon: ClipboardCheck },
  { key: 'jumlah_alternatif', label: 'Alternatif', icon: Layers3 },
  { key: 'jumlah_perhitungan', label: 'Perhitungan', icon: Activity },
] as const

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">{error}</div>
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="glass-panel rounded-[2rem]">
          <CardHeader>
            <div className="mb-4 inline-flex w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
              Ringkasan Platform
            </div>
            <CardTitle className="text-3xl">Pantau konfigurasi SAW dan riwayat keputusan terbaru.</CardTitle>
            <CardDescription>
              Dashboard ini merangkum kondisi data master, histori perhitungan, dan skor alternatif paling mutakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {statConfig.map((item) => (
              <div key={item.key} className="rounded-3xl border bg-background/70 p-5">
                <item.icon className="mb-4 h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-3xl font-bold">{data.stats[item.key]}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Top Rank Terbaru</CardTitle>
            <CardDescription>Alternatif dengan skor preferensi tertinggi hasil perhitungan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.hasil_terbaru?.hasil.ringkasan.alternatif_terbaik ? (
              <div className="space-y-4 rounded-3xl bg-primary/10 p-5">
                <div className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Rank #1
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{data.hasil_terbaru.hasil.ringkasan.alternatif_terbaik.alternatif_nama}</p>
                    <p className="text-sm text-muted-foreground">
                      Skor akhir {formatNumber(data.hasil_terbaru.hasil.ringkasan.alternatif_terbaik.skor, 6)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dihasilkan pada {formatDate(data.hasil_terbaru.created_at)} oleh {data.hasil_terbaru.user?.name}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada perhitungan yang tersimpan.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <RankingChart data={data.grafik_terbaru} title="Grafik Hasil Terbaru" />

        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>Riwayat Perhitungan</CardTitle>
            <CardDescription>10 sesi terbaru yang tersimpan di backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.riwayat.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada riwayat perhitungan.</p>
            ) : (
              data.riwayat.map((item) => (
                <div key={item.id} className="rounded-3xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.nama_sesi}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(item.created_at)}</p>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>{item.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Top rank:{' '}
                    <span className="font-semibold text-foreground">
                      {item.hasil?.ringkasan?.alternatif_terbaik?.alternatif_nama ?? '-'}
                    </span>
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
