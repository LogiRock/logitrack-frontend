
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { UserRole } from './roles'

interface HasRoleProps {
  roles: UserRole[]
  children: ReactNode
}

/**
 * Renderiza su contenido únicamente si el usuario tiene alguno de los roles permitidos.
 */
export function HasRole({ roles, children }: HasRoleProps) {
  const { roles: userRoles } = useAuth()

  const hasPermission = roles.some((role) => userRoles.includes(role))

  return hasPermission ? <>{children}</> : null
}
