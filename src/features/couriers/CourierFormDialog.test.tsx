import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotificationProvider } from '../../components/NotificationProvider'
import { couriersApi } from './api'
import { CourierFormDialog } from './CourierFormDialog'

vi.mock('./api', () => ({
  couriersApi: {
    crear: vi.fn(),
    actualizar: vi.fn(),
  },
}))

function renderDialog(onClose = vi.fn(), onSaved = vi.fn()) {
  return render(
    <NotificationProvider>
      <CourierFormDialog open courier={null} onClose={onClose} onSaved={onSaved} />
    </NotificationProvider>,
  )
}

describe('CourierFormDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('muestra errores de validación si se envía vacío', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: /registrar/i }))

    expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El tipo de vehículo es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El nombre de usuario es obligatorio')).toBeInTheDocument()
    expect(couriersApi.crear).not.toHaveBeenCalled()
  })

  it('envía los datos válidos al crear un repartidor y dispara onSaved', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSaved = vi.fn()
    vi.mocked(couriersApi.crear).mockResolvedValueOnce({
      id: '123',
      nombre: 'Juan Pérez',
      tipoVehiculo: 'Moto',
      estado: 'ACTIVO',
    })

    renderDialog(onClose, onSaved)

    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/tipo de vehículo/i), 'Moto')
    await user.type(screen.getByLabelText(/nombre de usuario/i), 'jperez')
    await user.type(screen.getByLabelText(/contraseña/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
      expect(couriersApi.crear).toHaveBeenCalledWith({
        nombre: 'Juan Pérez',
        tipoVehiculo: 'Moto',
        estado: 'ACTIVO',
        username: 'jperez',
        password: 'secret123',
      })
    })
    expect(onSaved).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('marca errores 400 del backend en los campos y muestra notificación en 409', async () => {
    const user = userEvent.setup()
    vi.mocked(couriersApi.crear).mockRejectedValueOnce({
      status: 400,
      mensaje: 'Datos inválidos',
      errores: { username: 'Ese usuario no está permitido' },
    })

    renderDialog()

    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Gómez')
    await user.type(screen.getByLabelText(/tipo de vehículo/i), 'Auto')
    await user.type(screen.getByLabelText(/nombre de usuario/i), 'agomez')
    await user.type(screen.getByLabelText(/contraseña/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /registrar/i }))

    expect(await screen.findByText('Ese usuario no está permitido')).toBeInTheDocument()
  })
})
