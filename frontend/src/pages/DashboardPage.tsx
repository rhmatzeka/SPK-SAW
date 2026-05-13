import { Activity, ClipboardCheck, Layers3, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'

import { RankingChart } from '@/components/modules/RankingChart'
import { Badge } from '@/components/ui/badge'
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
    return <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">{error}</div>
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 border-b pb-10 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="mb-5 inline-flex w-fit rounded-md bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground">
            Ringkasan Platform
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight">
            Pantau konfigurasi SAW dan riwayat keputusan terbaru.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            Dashboard ini merangkum kondisi data master, histori perhitungan, dan skor alternatif paling mutakhir.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {statConfig.map((item) => (
              <div key={item.key} className="border-l-2 border-primary/50 pl-5">
                <item.icon className="mb-5 h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-4xl font-semibold">{data.stats[item.key]}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="border-l-2 border-primary/40 pl-6">
          <p className="text-sm font-semibold uppercase text-muted-foreground">Top Rank Terbaru</p>
          {data.hasil_terbaru?.hasil.ringkasan.alternatif_terbaik ? (
            <div className="mt-5">
              <div className="mb-4 inline-flex rounded-md bg-primary/15 px-3 py-1 text-xs font-semibold text-foreground">
                Rank #1
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-2xl font-semibold">{data.hasil_terbaru.hasil.ringkasan.alternatif_terbaik.alternatif_nama}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Skor akhir {formatNumber(data.hasil_terbaru.hasil.ringkasan.alternatif_terbaik.skor, 6)}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                Dihasilkan pada {formatDate(data.hasil_terbaru.created_at)} oleh {data.hasil_terbaru.user?.name}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Belum ada perhitungan yang tersimpan.
            </p>
          )}
        </aside>
      </section>

      <section className="grid gap-10 xl:grid-cols-[1fr_0.9fr]">
        <RankingChart data={data.grafik_terbaru} title="Grafik Hasil Terbaru" />

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Riwayat Perhitungan</h2>
            <p className="mt-2 text-sm text-muted-foreground">10 sesi terbaru yang tersimpan di backend.</p>
          </div>
          <div className="divide-y">
            {data.riwayat.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada riwayat perhitungan.</p>
            ) : (
              data.riwayat.map((item) => (
                <div key={item.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.nama_sesi}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatDate(item.created_at)}</p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Top rank:{' '}
                        <span className="font-semibold text-foreground">
                          {item.hasil?.ringkasan?.alternatif_terbaik?.alternatif_nama ?? '-'}
                        </span>
                      </p>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>{item.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  )
}
