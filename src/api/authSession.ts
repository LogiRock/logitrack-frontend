import { jwtDecode } from 'jwt-decode'

export type UserRole = 'ADMIN' | 'CLIENTE' | 'REPARTIDOR'

interface JwtPayload {
  sub?: string
  userId?: string
  roles?: string[]
}

const TOKEN_KEYS = ['token', 'accessToken', 'jwt', 'auth_token']

export function getStoredToken(): string | null {
  for (const key of TOKEN_KEYS) {
    const value = sessionStorage.getItem(key)
    if (value) return value
  }
  return null
}

export function getCurrentUserRoles(): UserRole[] {
  const token = getStoredToken()
  if (!token) return []

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const rawRoles = decoded.roles ?? []
    const normalized: UserRole[] = []

    for (const r of rawRoles) {
      if (r === 'ROLE_ADMIN' || r === 'ADMIN') normalized.push('ADMIN')
      if (r === 'ROLE_CLIENTE' || r === 'CLIENTE') normalized.push('CLIENTE')
      if (r === 'ROLE_REPARTIDOR' || r === 'REPARTIDOR') normalized.push('REPARTIDOR')
    }
    return normalized
  } catch {
    return []
  }
}

export function hasRole(role: UserRole): boolean {
  return getCurrentUserRoles().includes(role)
}
