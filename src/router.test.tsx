import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from './auth/AuthContext'
import { NotificationProvider } from './components/NotificationProvider'
import { routes } from './router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <NotificationProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </NotificationProvider>,
  )
}

describe('router', () => {
  it('muestra el home en /', () => {
    renderAt('/')
    expect(screen.getByText('Bienvenido a Logirock')).toBeInTheDocument()
  })

  it('muestra la página 404 en una ruta inexistente', () => {
    renderAt('/no-existe')
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument()
  })

  it('sin sesión, una ruta privada lleva al login', async () => {
    renderAt('/repartidores')
    expect(await screen.findByRole('button', { name: /ingresar|iniciar sesión/i })).toBeInTheDocument()
  })
})
