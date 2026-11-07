import { http } from '../../api/http'

export type EstadoRepartidor = 'ACTIVO' | 'INACTIVO'

export interface RepartidorResponseDto {
  id: string
  nombre: string
  tipoVehiculo: string
  estado: EstadoRepartidor
}

export interface RepartidorRequestDto {
  nombre: string
  tipoVehiculo: string
  estado: EstadoRepartidor
  username: string
  password: string
}

export interface RepartidorUpdateDto {
  nombre: string
  tipoVehiculo: string
}

export interface EstadoRepartidorRequestDto {
  estado: EstadoRepartidor
}

export interface DisponibilidadRepartidorResponseDto {
  disponible: boolean
  motivo: string | null
}

const BASE_PATH = '/application/couriers/api/v1/repartidores'

export const couriersApi = {
  listar: async (): Promise<RepartidorResponseDto[]> => {
    const { data } = await http.get<RepartidorResponseDto[]>(BASE_PATH)
    return data
  },

  obtenerPorId: async (id: string): Promise<RepartidorResponseDto> => {
    const { data } = await http.get<RepartidorResponseDto>(`${BASE_PATH}/${id}`)
    return data
  },

  consultarDisponibilidad: async (id: string): Promise<DisponibilidadRepartidorResponseDto> => {
    const { data } = await http.get<DisponibilidadRepartidorResponseDto>(
      `${BASE_PATH}/${id}/disponibilidad`,
    )
    return data
  },

  crear: async (payload: RepartidorRequestDto): Promise<RepartidorResponseDto> => {
    const { data } = await http.post<RepartidorResponseDto>(BASE_PATH, payload)
    return data
  },

  actualizar: async (id: string, payload: RepartidorUpdateDto): Promise<RepartidorResponseDto> => {
    const { data } = await http.put<RepartidorResponseDto>(`${BASE_PATH}/${id}`, payload)
    return data
  },

  cambiarEstado: async (
    id: string,
    payload: EstadoRepartidorRequestDto,
  ): Promise<RepartidorResponseDto> => {
    const { data } = await http.patch<RepartidorResponseDto>(`${BASE_PATH}/${id}/estado`, payload)
    return data
  },

  eliminar: async (id: string): Promise<void> => {
    await http.delete(`${BASE_PATH}/${id}`)
  },

  obtenerMiPerfil: async (): Promise<RepartidorResponseDto> => {
    const { data } = await http.get<RepartidorResponseDto>(`${BASE_PATH}/me`)
    return data
  },
}
