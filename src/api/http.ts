import axios from 'axios'

/**
 * Única instancia de Axios de la app. Todas las llamadas al backend pasan por acá.
 * Los interceptores los agregan M2 (token y 401/403) y F1 (errores).
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})
