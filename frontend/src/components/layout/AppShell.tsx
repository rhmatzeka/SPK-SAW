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
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-background p-6 transition-transform lg:sticky lg:top-0 lg:translate-x-0',
            open ? 'translate-x-0' : '-translate-x-[120%]',
          )}
        >
          <div className="mb-8">
            <div className="mb-3 inline-flex rounded-md bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              Sistem Penunjang Keputusan
            </div>
            <h1 className="text-2xl font-semibold">SPK SAW</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Dashboard sederhana untuk pengambilan keputusan.</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg border-l-2 px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
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
                    'flex items-center gap-3 rounded-lg border-l-2 px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                <ShieldCheck className="h-4 w-4" />
                Manajemen User
              </NavLink>
            )}
          </nav>

          <div className="mt-auto border-t pt-6 text-sm">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
            <p className="mt-3 inline-flex rounded-md bg-secondary px-2 py-1 text-xs uppercase">
              {user?.role}
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col px-5 py-6 lg:px-8">
          <header className="mb-8 border-b pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="lg:hidden" onClick={() => setOpen((value) => !value)}>
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Workspace</p>
                  <h2 className="text-2xl font-semibold">{title}</h2>
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
            <div className="flex flex-col justify-between gap-2 border-t pt-5 md:flex-row md:items-center">
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
