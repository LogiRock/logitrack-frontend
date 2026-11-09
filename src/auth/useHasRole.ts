
import { useAuth } from './AuthContext'
import type { UserRole } from './roles'

/**
 * Permite comprobar desde cualquier componente si el usuario tiene un rol determinado.
 */
export function useHasRole() {
  const { roles: userRoles } = useAuth()

  const hasRole = (roles: UserRole[]) =>
    roles.some((role) => userRoles.includes(role))

  return { hasRole, roles: userRoles }
}
