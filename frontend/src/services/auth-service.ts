import { api } from '@/services/api'
import type { ApiResponse, User } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  token_type: string
  user: User
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/login', payload)
    return data.data
  },
  async me() {
    const { data } = await api.get<ApiResponse<User>>('/me')
    return data.data
  },
  async logout() {
    await api.post('/logout')
  },
}
