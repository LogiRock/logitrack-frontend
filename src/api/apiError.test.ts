import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { toApiError } from './apiError'

function mockAxiosError(status?: number, data?: unknown): AxiosError {
  const err = new AxiosError('Request failed')
  if (status !== undefined) {
    err.response = {
      status,
      statusText: 'Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data,
    }
  }
  return err
}

describe('toApiError', () => {
  it('retorna status 0 cuando no hay respuesta del servidor', () => {
    const result = toApiError(mockAxiosError())
    expect(result.status).toBe(0)
    expect(result.mensaje).toMatch(/sin conexión/i)
  })

  it('prioriza detail ?? message ?? title del backend', () => {
    const problemDetail = toApiError(
      mockAxiosError(409, { title: 'Conflict', detail: 'El username ya existe' }),
    )
    expect(problemDetail).toEqual({ status: 409, mensaje: 'El username ya existe' })

    const dtoError = toApiError(
      mockAxiosError(404, { error: 'Not Found', message: 'Repartidor no encontrado' }),
    )
    expect(dtoError).toEqual({ status: 404, mensaje: 'Repartidor no encontrado' })
  })

  it('retorna "Servicio no disponible" para 503 y mensaje genérico para 5xx', () => {
    expect(toApiError(mockAxiosError(503, {})).mensaje).toBe('Servicio no disponible')
    expect(toApiError(mockAxiosError(500, {})).status).toBe(500)
  })

  it('extrae errores de validación en un mapa campo -> mensaje para 400', () => {
    const result = toApiError(
      mockAxiosError(400, {
        message: 'Error de validación',
        validationErrors: ['nombre: El nombre es obligatorio', 'password: Mínimo 8 caracteres'],
      }),
    )
    expect(result.status).toBe(400)
    expect(result.errores).toEqual({
      nombre: 'El nombre es obligatorio',
      password: 'Mínimo 8 caracteres',
    })
  })
})
