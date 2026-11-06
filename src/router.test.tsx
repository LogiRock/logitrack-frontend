import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from './router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
}

describe('router', () => {
  it('muestra el home en /', () => {
    renderAt('/')
    expect(screen.getByText('Bienvenido a LogiTrack')).toBeInTheDocument()
  })

  it('muestra la página 404 en una ruta inexistente', () => {
    renderAt('/no-existe')
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument()
  })
})
