import axios from 'axios'

export interface ApiError {
  status: number
  mensaje: string
  errores?: Record<string, string>
}

interface BackendErrorPayload {
  status?: number
  title?: string
  detail?: string
  message?: string
  error?: string
  validationErrors?: string[]
  errors?: Record<string, string>
}

function parseValidationErrors(payload?: BackendErrorPayload): Record<string, string> | undefined {
  if (!payload) return undefined

  if (payload.errors && typeof payload.errors === 'object' && !Array.isArray(payload.errors)) {
    return Object.keys(payload.errors).length > 0 ? payload.errors : undefined
  }

  if (Array.isArray(payload.validationErrors) && payload.validationErrors.length > 0) {
    const mapped: Record<string, string> = {}
    for (const item of payload.validationErrors) {
      const separatorIndex = item.indexOf(':')
      if (separatorIndex > 0) {
        const field = item.slice(0, separatorIndex).trim()
        const msg = item.slice(separatorIndex + 1).trim()
        mapped[field] = msg
      } else {
        mapped.root = item
      }
    }
    return mapped
  }

  return undefined
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'mensaje' in error &&
    typeof (error as ApiError).status === 'number' &&
    typeof (error as ApiError).mensaje === 'string'
  )
}


export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error
  }
  if (!axios.isAxiosError(error)) {
    return {
      status: 0,
      mensaje: error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
    }
  }

  // Sin respuesta del servidor (caído, CORS bloqueado o sin red)
  if (!error.response) {
    return {
      status: 0,
      mensaje: 'Sin conexión con el servidor. Verificá tu red o que el backend esté activo.',
    }
  }

  const status = error.response.status
  const data = error.response.data as BackendErrorPayload | undefined
  const backendMessage = data?.detail ?? data?.message ?? data?.title ?? data?.error
  const errores = parseValidationErrors(data)

  if (status === 503) {
    return { status, mensaje: 'Servicio no disponible' }
  }

  if (status >= 500) {
    return {
      status,
      mensaje: backendMessage ?? 'Error interno del servidor. Intentá nuevamente más tarde.',
    }
  }
  if (status === 401) {
    return {
      status,
      mensaje: backendMessage ?? 'Credenciales incorrectas.',
    }
  }

  if (status === 403) {
    return {
      status,
      mensaje: backendMessage ?? 'No tenés permisos para realizar esta operación.',
    }
  }

  if (status === 404) {
    return {
      status,
      mensaje: backendMessage ?? 'El recurso solicitado no existe.',
    }
  }

  if (status === 409) {
    return {
      status,
      mensaje: backendMessage ?? 'Conflicto con el estado actual del recurso.',
    }
  }

  if (status === 400) {
    return {
      status,
      mensaje: backendMessage ?? 'Datos inválidos. Revisá los campos del formulario.',
      errores,
    }
  }

  return {
    status,
    mensaje: backendMessage ?? 'No se pudo completar la operación.',
    errores,
  }
}
