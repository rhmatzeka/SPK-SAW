import { BarChart3, Calculator, ClipboardList, LayoutDashboard, LogOut, Menu, Moon, ShieldCheck, Sun, Trophy, Users } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/store/auth-store'
import { useThemeStore } from '@/store/theme-store'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/kriteria', label: 'Kriteria', icon: ClipboardList },
  { to: '/alternatif', label: 'Alternatif', icon: Users },
  { to: '/nilai', label: 'Matriks Nilai', icon: Calculator },
  { to: '/perhitungan', label: 'Hasil SAW', icon: Trophy },
]

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearSession } = useAuthStore()
  const { mode, toggleMode } = useThemeStore()
  const [open, setOpen] = useState(false)

  const title = useMemo(() => {
    const match = navItems.find((item) => item.to === location.pathname)
    if (location.pathname === '/users') {
      return 'Manajemen User'
    }
    return match?.label ?? 'SPK Metode SAW'
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {
      // noop
    } finally {
      clearSession()
      toast.success('Sesi berhasil diakhiri.')
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="page-gradient min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-4 px-4 py-4 lg:px-6">
        <aside
          className={cn(
            'glass-panel fixed inset-y-4 left-4 z-40 w-72 rounded-3xl border p-5 transition-transform lg:static lg:translate-x-0',
            open ? 'translate-x-0' : '-translate-x-[120%]',
          )}
        >
          <div className="mb-8">
            <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Sistem Penunjang Keputusan
            </div>
            <h1 className="text-2xl font-bold">SPK SAW Studio</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Kelola kriteria, alternatif, matriks keputusan, dan laporan hasil ranking secara real-time.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}

            {user?.role === 'admin' && (
              <NavLink
                to="/users"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-muted',
                  )
                }
              >
                <ShieldCheck className="h-4 w-4" />
                Manajemen User
              </NavLink>
            )}
          </nav>

          <div className="mt-8 rounded-2xl bg-secondary p-4 text-sm">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
            <p className="mt-2 inline-flex rounded-full bg-background px-2 py-1 text-xs uppercase tracking-wide">
              {user?.role}
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="glass-panel sticky top-4 z-30 mb-4 rounded-3xl border px-4 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="lg:hidden" onClick={() => setOpen((value) => !value)}>
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">workspace</p>
                  <h2 className="text-2xl font-bold">{title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={toggleMode}>
                  {mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {mode === 'light' ? 'Dark' : 'Light'}
                </Button>
                <Button variant="secondary" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>

          <footer className="px-2 py-6 text-sm text-muted-foreground">
            <div className="glass-panel flex flex-col justify-between gap-2 rounded-3xl border px-5 py-4 md:flex-row md:items-center">
              <span>SPK Metode SAW dengan React, Zustand, Laravel Sanctum, dan Recharts.</span>
              <span className="inline-flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Mobile-first dan siap dikembangkan ke production.
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
