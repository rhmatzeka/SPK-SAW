import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/utils'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/store/auth-store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((state) => state.setSession)
  const [form, setForm] = useState({ email: 'admin@spk.test', password: 'password' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login(form)
      setSession({ token: response.token, user: response.user })
      toast.success('Login berhasil.')
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal login.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-gradient flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel hidden rounded-[2rem] border p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Modern Decision Engine
            </div>
            <h1 className="max-w-lg text-5xl font-bold leading-tight">
              Sistem Penunjang Keputusan berbasis SAW yang rapi, cepat, dan siap production.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Kelola bobot kriteria, matriks alternatif, normalisasi, ranking, dan laporan PDF/Excel dalam satu dashboard.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {['Role-based access', 'History perhitungan', 'Chart & export laporan'].map((label) => (
              <div key={label} className="rounded-2xl border bg-background/70 p-4 text-sm font-medium">
                {label}
              </div>
            ))}
          </div>
        </section>

        <Card className="glass-panel rounded-[2rem] border">
          <CardHeader className="space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <CardTitle className="text-3xl">Masuk ke aplikasi</CardTitle>
            <CardDescription>
              Gunakan akun seed default: `admin@spk.test` / `password` atau `user@spk.test` / `password`.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
                  placeholder="********"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Button className="w-full" size="lg" disabled={loading} type="submit">
                {loading ? 'Memproses...' : 'Masuk'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
