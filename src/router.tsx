import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CouriersListPage } from './features/couriers/CouriersListPage'
import { MyCourierProfilePage } from './features/couriers/MyCourierProfilePage'
import { ShipmentsListPage } from './features/shipment-service/ShipmentsListPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/envios', element: <ShipmentsListPage /> },
      { path: '/repartidores', element: <CouriersListPage /> },
      { path: '/mi-perfil', element: <MyCourierProfilePage /> },
      { path: '/forbidden', element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
