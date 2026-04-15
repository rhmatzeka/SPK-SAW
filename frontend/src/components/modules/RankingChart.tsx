import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="alternatif_nama" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value: number) => formatNumber(value, 2)} />
              <Tooltip formatter={(value) => formatNumber(Number(value ?? 0), 6)} />
              <Bar dataKey="skor" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
