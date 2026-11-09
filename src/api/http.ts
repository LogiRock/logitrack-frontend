import axios from 'axios'
import { getStoredToken } from './authSession'
import { toApiError } from './apiError'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Evita procesar varias veces errores de autenticación consecutivos.
let handlingAuthError = false

// Se restablece cuando el usuario inicia sesión nuevamente.
export function resetAuthErrorHandling(): void {
  handlingAuthError = false
}

http.interceptors.request.use((config) => {
  // El login es público y no necesita enviar un token anterior.
  if (config.url?.includes('/api/auth/login')) return config

  const token = getStoredToken()
  if (token) config.headers.Authorization = `Bearer ${token}`

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const url = error?.config?.url ?? ''
    const isLoginRequest = url.includes('/api/auth/login')

    // Un 401 o 403 invalida la sesión y notifica a los componentes de la aplicación.
    if ((status === 401 || status === 403) && !isLoginRequest) {
      if (!handlingAuthError) {
        handlingAuthError = true

        const message =
          status === 401
            ? 'Tu sesión expiró. Ingresá nuevamente.'
            : 'No tenés permisos para esta acción. Ingresá nuevamente.'

        window.dispatchEvent(
          new CustomEvent('auth:unauthorized', {
            detail: { message },
          }),
        )
      }

      return Promise.reject(error)
    }

    return Promise.reject(toApiError(error))
  },
)