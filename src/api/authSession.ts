import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '../auth/types'
import type { UserRole } from '../auth/roles'

const TOKEN_KEY = 'accessToken'

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  sessionStorage.removeItem(TOKEN_KEY)
}

export function getTokenPayload(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token)

    if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
      return null
    }

    return decoded
  } catch {
    return null
  }
}

export function getRolesFromToken(token: string): UserRole[] {
  const payload = getTokenPayload(token)

  if (!payload) return []

  const roles: UserRole[] = []

  for (const role of payload.roles ?? []) {
    if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
      roles.push('ADMIN')
    }

    if (role === 'CLIENTE' || role === 'ROLE_CLIENTE') {
      roles.push('CLIENTE')
    }

    if (role === 'REPARTIDOR' || role === 'ROLE_REPARTIDOR') {
      roles.push('REPARTIDOR')
    }
  }

  return [...new Set(roles)]
}

export function getCurrentUserRoles(): UserRole[] {
  const token = getStoredToken()
  return token ? getRolesFromToken(token) : []
}

export function hasRole(role: UserRole): boolean {
  return getCurrentUserRoles().includes(role)
}