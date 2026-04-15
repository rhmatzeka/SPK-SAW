import { saveAs } from 'file-saver'

import { api } from '@/services/api'
import type {
  Alternatif,
  ApiResponse,
  DashboardData,
  Kriteria,
  MatrixPayload,
  Perhitungan,
  User,
  WeightSummary,
} from '@/types'

export const dashboardService = {
  async getDashboard() {
    const { data } = await api.get<ApiResponse<DashboardData>>('/dashboard')
    return data.data
  },
}

export const usersService = {
  async list() {
    const { data } = await api.get<ApiResponse<User[]>>('/users')
    return data.data
  },
  async create(payload: Partial<User> & { password?: string }) {
    const { data } = await api.post<ApiResponse<User>>('/users', payload)
    return data.data
  },
  async update(id: number, payload: Partial<User> & { password?: string }) {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, payload)
    return data.data
  },
  async remove(id: number) {
    await api.delete(`/users/${id}`)
  },
}

export const criteriaService = {
  async list() {
    const { data } = await api.get<ApiResponse<{ items: Kriteria[]; summary: WeightSummary }>>('/kriteria')
    return data.data
  },
  async create(payload: Partial<Kriteria>) {
    const { data } = await api.post<ApiResponse<{ item: Kriteria; summary: WeightSummary }>>('/kriteria', payload)
    return data.data
  },
  async update(id: number, payload: Partial<Kriteria>) {
    const { data } = await api.put<ApiResponse<{ item: Kriteria; summary: WeightSummary }>>(`/kriteria/${id}`, payload)
    return data.data
  },
  async remove(id: number) {
    const { data } = await api.delete<ApiResponse<{ summary: WeightSummary }>>(`/kriteria/${id}`)
    return data.data
  },
}

export const alternatifService = {
  async list() {
    const { data } = await api.get<ApiResponse<Alternatif[]>>('/alternatif')
    return data.data
  },
  async create(payload: FormData) {
    const { data } = await api.post<ApiResponse<Alternatif>>('/alternatif', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },
  async update(id: number, payload: FormData) {
    payload.append('_method', 'PUT')
    const { data } = await api.post<ApiResponse<Alternatif>>(`/alternatif/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },
  async remove(id: number) {
    await api.delete(`/alternatif/${id}`)
  },
}

export const nilaiService = {
  async getMatrix() {
    const { data } = await api.get<ApiResponse<MatrixPayload>>('/nilai')
    return data.data
  },
  async saveMatrix(items: Array<{ alternatif_id: number; kriteria_id: number; nilai: number }>) {
    await api.put('/nilai/bulk', { items })
  },
}

export const perhitunganService = {
  async list() {
    const { data } = await api.get<ApiResponse<Perhitungan[]>>('/perhitungan')
    return data.data
  },
  async latest() {
    const { data } = await api.get<ApiResponse<Perhitungan | null>>('/perhitungan/latest')
    return data.data
  },
  async process(nama_sesi: string) {
    const { data } = await api.post<ApiResponse<Perhitungan>>('/perhitungan', { nama_sesi })
    return data.data
  },
  async show(id: number) {
    const { data } = await api.get<ApiResponse<Perhitungan>>(`/perhitungan/${id}`)
    return data.data
  },
  async downloadExport(id: number, type: 'pdf' | 'excel') {
    const response = await api.get(`/perhitungan/${id}/export/${type}`, {
      responseType: 'blob',
    })

    const extension = type === 'pdf' ? 'pdf' : 'xls'
    saveAs(response.data, `hasil-perhitungan-${id}.${extension}`)
  },
}
