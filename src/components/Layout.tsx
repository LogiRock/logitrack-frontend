import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  UserRound,
  LogOut,
  Menu,
  LogIn,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ROLES } from '../auth/roles'

const DRAWER_WIDTH = 260

interface NavigationItem {
  label: string
  path: string
  icon: LucideIcon
}

export function Layout() {
  const { user, isAuthenticated, logout, roles } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [mobileOpen, setMobileOpen] = useState(false)

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

  const navigationItems: NavigationItem[] = [
    {
      label: 'Inicio',
      path: '/',
      icon: LayoutDashboard,
    },
    ...(roles.includes(ROLES.ADMIN)
      ? [
        {
          label: 'Envíos',
          path: '/envios',
          icon: Package,
        },
        {
          label: 'Repartidores',
          path: '/repartidores',
          icon: Users,
        },
      ]
      : []),
    ...(roles.includes(ROLES.CLIENTE)
      ? [
        {
          label: 'Mis envíos',
          path: '/envios',
          icon: Package,
        },
      ]
      : []),
    ...(roles.includes(ROLES.REPARTIDOR)
      ? [
        {
          label: 'Mis entregas',
          path: '/envios',
          icon: Truck,
        },
        {
          label: 'Mi perfil',
          path: '/mi-perfil',
          icon: UserRound,
        },
      ]
      : []),
  ]

  const isSelected = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#101C16',
        color: '#FFFFFF',
      }}
    >
      {/* Identidad visual de LogiTrack. */}
      <Box sx={{ px: 3, py: 3.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              color: '#10251A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Truck size={25} strokeWidth={2.5} />
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}
            >
              LogiRock
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#91A69A', letterSpacing: 1 }}
            >
              GESTIÓN LOGÍSTICA
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#26382D' }} />

      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: '#82968A',
            fontWeight: 700,
            letterSpacing: 1.2,
            px: 1.5,
          }}
        >
          MENÚ PRINCIPAL
        </Typography>
      </Box>

      <List sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const selected = isSelected(item.path)

          return (
            <ListItemButton
              key={`${item.path}-${item.label}`}
              component={RouterLink}
              to={item.path}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                minHeight: 48,
                mb: 0.7,
                px: 1.5,
                borderRadius: 2,
                color: selected ? '#68FD9D' : '#B3C2B8',
                transition: 'all 180ms ease',
                '&:hover': {
                  bgcolor: '#1D3025',
                  color: '#FFFFFF',
                },
                '&.Mui-selected': {
                  bgcolor: '#203A2B',
                  color: '#68FD9D',
                  '&:hover': {
                    bgcolor: '#294A35',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 9,
                    bottom: 9,
                    width: 3,
                    borderRadius: 4,
                    bgcolor: '#68FD9D',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'inherit',
                }}
              >
                <Icon size={20} strokeWidth={2} />
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 14,
                      fontWeight: selected ? 700 : 500,
                    },
                  },
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      <Divider sx={{ borderColor: '#26382D' }} />

      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#1B2B21',
              mb: 1.5,
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: '#10251A',
                fontWeight: 800,
                width: 38,
                height: 38,
              }}
            >
              {user?.username?.charAt(0).toUpperCase() ?? 'U'}
            </Avatar>

            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ color: '#FFFFFF', fontWeight: 700 }}
              >
                {user?.username}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#91A69A' }}
              >
                {user?.rol}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            onClick={handleLogout}
            startIcon={<LogOut size={18} />}
            sx={{
              justifyContent: 'flex-start',
              color: '#E5A3A3',
              px: 1.5,
              py: 1,
              '&:hover': {
                bgcolor: '#392528',
                color: '#FFB4B4',
              },
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      )}
    </Box>
  )

  // Las pantallas públicas mantienen una navegación sencilla.
  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: '#101C16',
            color: '#FFFFFF',
            border: 0,
          }}
        >
          <Toolbar>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexGrow: 1,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Truck color="#68FD9D" size={27} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                LogiRock
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              startIcon={<LogIn size={18} />}
            >
              Ingresar
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
          <Outlet />
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: '#101C16',
            color: '#FFFFFF',
            border: 0,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
              aria-label="Abrir menú"
            >
              <Menu />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              LogiRock
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Chip
              label={user?.rol}
              size="small"
              sx={{
                bgcolor: '#203A2B',
                color: '#68FD9D',
                fontWeight: 700,
              }}
            />
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={!isMobile || mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: DRAWER_WIDTH,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 0,
              borderRadius: 0,
              bgcolor: '#101C16',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          bgcolor: 'background.default',
          pt: isMobile ? '64px' : 0,
        }}
      >
        

        <Container
          maxWidth={false}
          sx={{
            py: { xs: 3, md: 4 },
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            maxWidth: 1600,
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
