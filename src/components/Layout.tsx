import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Link as RouterLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { HasRole } from '../auth/HasRole'
import { ROLES } from '../auth/roles'

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  // Redirige al login cuando Axios detecta un error de autenticación.
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login', { replace: true })
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [navigate])

  // Cierra la sesión y devuelve al usuario a la pantalla de ingreso.
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            LogiTrack
          </Typography>

          {isAuthenticated ? (
            <>
              {/* ADMIN: gestiona envíos y repartidores. */}
              <HasRole roles={[ROLES.ADMIN]}>
                <Button color="inherit" component={RouterLink} to="/envios">
                  Envíos
                </Button>
                <Button color="inherit" component={RouterLink} to="/repartidores">
                  Repartidores
                </Button>
              </HasRole>

              {/* CLIENTE: consulta sus propios envíos. */}
              <HasRole roles={[ROLES.CLIENTE]}>
                <Button color="inherit" component={RouterLink} to="/envios">
                  Mis envíos
                </Button>
              </HasRole>

              {/* REPARTIDOR: consulta sus entregas asignadas y su perfil. */}
              <HasRole roles={[ROLES.REPARTIDOR]}>
                <Button color="inherit" component={RouterLink} to="/envios">
                  Mis entregas
                </Button>
                <Button color="inherit" component={RouterLink} to="/mi-perfil">
                  Mi perfil
                </Button>
              </HasRole>

              <Typography variant="body2" sx={{ mx: 2 }}>
                {user?.username} ({user?.rol})
              </Typography>

              <Button color="inherit" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Ingresar
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}