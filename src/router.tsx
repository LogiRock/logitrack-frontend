import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { CouriersListPage } from './features/couriers/CouriersListPage'
import { MyCourierProfilePage } from './features/couriers/MyCourierProfilePage'
import { ShipmentsListPage } from './features/shipment-service/ShipmentsListPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'

import { ROLES } from './auth/roles'

export const routes: RouteObject[] = [
{
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },

      {
        path: '/envios',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.CLIENTE, ROLES.REPARTIDOR]}>
            <ShipmentsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/repartidores',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <CouriersListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/mi-perfil',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.REPARTIDOR]}>
            <MyCourierProfilePage />
          </ProtectedRoute>
        ),
      },

      { path: '/forbidden', element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
export const router = createBrowserRouter(routes)
