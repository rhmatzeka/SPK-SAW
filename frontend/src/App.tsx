import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import { AlternatifPage } from '@/pages/AlternatifPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { KriteriaPage } from '@/pages/KriteriaPage'
import { LoginPage } from '@/pages/LoginPage'
import { NilaiPage } from '@/pages/NilaiPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PerhitunganPage } from '@/pages/PerhitunganPage'
import { UsersPage } from '@/pages/UsersPage'

function AppRoutes() {
  useAuthBootstrap()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="kriteria" element={<KriteriaPage />} />
        <Route path="alternatif" element={<AlternatifPage />} />
        <Route path="nilai" element={<NilaiPage />} />
        <Route path="perhitungan" element={<PerhitunganPage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={['admin']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}
