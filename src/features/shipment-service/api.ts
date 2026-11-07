import { http } from '../../api/http'

export type EstadoEnvio = 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO'

export interface Direccion {
  calle: string
  numero: string
  ciudad: string
  codigoPostal: string
}

export interface EnvioRequestDto {
  peso: number
  ancho: number
  alto: number
  largo: number
  origen: Direccion
  destino: Direccion
}

export interface EnvioResponseDto {
  id: string
  codigoSeguimiento: string
  peso: number
  ancho: number
  alto: number
  largo: number
  estado: EstadoEnvio
  courierId: string | null
  clienteId: string
  clienteNombre: string
  origen: Direccion
  destino: Direccion
}

export interface EstadoEnvioRequestDto {
  estado: EstadoEnvio
}

export interface HistorialEstadoEnvioResponseDto {
  idHistorial: string
  estadoAnterior: EstadoEnvio | null
  estadoNuevo: EstadoEnvio
  fechaCambio: string
}

export interface RegistroClienteRequestDto {
  nombre: string
  email: string
  telefono: string
  username: string
  password: string
}

export interface ClienteResponseDto {
  id: string
  nombre: string
  email: string
  telefono: string
}

const ENVIOS_PATH = '/application/shipments/api/v1/envios'
const CLIENTES_PATH = '/application/shipments/api/v1/clientes'

export const shipmentsApi = {
  listar: async (): Promise<EnvioResponseDto[]> => {
    const { data } = await http.get<EnvioResponseDto[]>(ENVIOS_PATH)
    return data
  },

  buscarPorId: async (id: string): Promise<EnvioResponseDto> => {
    const { data } = await http.get<EnvioResponseDto>(`${ENVIOS_PATH}/${id}`)
    return data
  },

  buscarPorEstado: async (estado: EstadoEnvio): Promise<EnvioResponseDto[]> => {
    const { data } = await http.get<EnvioResponseDto[]>(`${ENVIOS_PATH}/estado/${estado}`)
    return data
  },

  crear: async (payload: EnvioRequestDto): Promise<EnvioResponseDto> => {
    const { data } = await http.post<EnvioResponseDto>(ENVIOS_PATH, payload)
    return data
  },

  asignarCourier: async (envioId: string, courierId: string): Promise<EnvioResponseDto> => {
    const { data } = await http.put<EnvioResponseDto>(
      `${ENVIOS_PATH}/${envioId}/courier/${courierId}`,
    )
    return data
  },

  cambiarEstado: async (id: string, payload: EstadoEnvioRequestDto): Promise<EnvioResponseDto> => {
    const { data } = await http.patch<EnvioResponseDto>(`${ENVIOS_PATH}/${id}/estado`, payload)
    return data
  },

  cancelar: async (id: string): Promise<EnvioResponseDto> => {
    const { data } = await http.post<EnvioResponseDto>(`${ENVIOS_PATH}/${id}/cancelacion`)
    return data
  },

  consultarHistorial: async (id: string): Promise<HistorialEstadoEnvioResponseDto[]> => {
    const { data } = await http.get<HistorialEstadoEnvioResponseDto[]>(
      `${ENVIOS_PATH}/${id}/historial`,
    )
    return data
  },

  registrarCliente: async (payload: RegistroClienteRequestDto): Promise<ClienteResponseDto> => {
    const { data } = await http.post<ClienteResponseDto>(CLIENTES_PATH, payload)
    return data
  },
}
