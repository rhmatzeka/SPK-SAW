import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-4xl">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Halaman yang kamu cari tidak ditemukan.</p>
          <Button asChild>
            <Link to="/">Kembali ke dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
