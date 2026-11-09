import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getRolesFromToken,
  getStoredToken,
  getTokenPayload,
  removeToken,
  saveToken,
} from '../api/authSession'
import { authApi } from './authApi'
import type { User, LoginRequest } from './types'
import type { UserRole } from './roles'
import { resetAuthErrorHandling } from '../api/http'

interface AuthContextType {
  user: User | null
  roles: UserRole[]
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    removeToken()
    setToken(null)
    setUser(null)
    setLoading(false)
  }, [])

  // Recuperar la sesión al iniciar la aplicación.
  useEffect(() => {
    const storedToken = getStoredToken()

    if (!storedToken || !getTokenPayload(storedToken)) {
      logout()
      return
    }

    setToken(storedToken)

    authApi
      .me()
      .then((currentUser) => {
        setUser(currentUser)
      })
      .catch(() => {
        logout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [logout])

  // Cerrar sesión automáticamente al vencer el JWT.
  useEffect(() => {
    if (!token) return

    const payload = getTokenPayload(token)

    if (!payload?.exp) {
      logout()
      return
    }

    const remainingTime = payload.exp * 1000 - Date.now()

    if (remainingTime <= 0) {
      logout()
      return
    }

    const timeoutId = window.setTimeout(logout, remainingTime)

    return () => window.clearTimeout(timeoutId)
  }, [token, logout])

  // Cerrar sesión si otra petición recibe un 401.
  useEffect(() => {
    window.addEventListener('auth:unauthorized', logout)

    return () => {
      window.removeEventListener('auth:unauthorized', logout)
    }
  }, [logout])

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true)

      try {
        const response = await authApi.login(credentials)

        const payload = getTokenPayload(response.accessToken)

        if (!payload) {
          throw new Error('El servidor devolvió un token inválido o vencido.')
        }

        
        resetAuthErrorHandling()

        saveToken(response.accessToken)
        setToken(response.accessToken)

        const currentUser = await authApi.me()
        setUser(currentUser)
      } catch (error) {
        logout()
        throw error
      } finally {
        setLoading(false)
      }
    },
    [logout],
  )

  const roles = useMemo(
    () => (token ? getRolesFromToken(token) : []),
    [token],
  )

  const value = useMemo(
    () => ({
      user,
      roles,
      isAuthenticated: Boolean(user && token),
      loading,
      login,
      logout,
    }),
    [user, roles, token, loading, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  }

  return context
}