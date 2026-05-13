import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { formatNumber } from '@/lib/utils'
import type { RankingItem } from '@/types'

export function RankingChart({
  data,
  title = 'Perbandingan Skor Alternatif',
}: {
  data: RankingItem[]
  title?: string
}) {
  return (
    <section className="h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <div className="h-80 border-l-2 border-primary/40 pl-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="alternatif_nama" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value: number) => formatNumber(value, 2)} />
            <Tooltip formatter={(value) => formatNumber(Number(value ?? 0), 6)} />
            <Bar dataKey="skor" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
