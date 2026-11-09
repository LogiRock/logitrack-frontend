import { http } from '../api/http'
import type { AuthResponse, LoginRequest, User } from './types'

const AUTH_PATH = '/application/auth/api/auth'

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await http.post<AuthResponse>(
      `${AUTH_PATH}/login`,
      payload,
    )
    return data
  },

  me: async (): Promise<User> => {
    const { data } = await http.get<User>(`${AUTH_PATH}/me`)
    return data
  },
}