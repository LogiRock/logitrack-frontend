
import { Box, Typography, Paper } from '@mui/material'
import { Package, Truck, ShieldCheck } from 'lucide-react'

export function HomePage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}
        >
          Bienvenido a Logirock
        </Typography>

        <Typography color="text.secondary">
          Gestioná tus envíos y repartidores desde un solo lugar.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2.5,
        }}
      >
        {[
          {
            title: 'Gestión de envíos',
            description: 'Consultá y administrá el seguimiento de los envíos.',
            icon: Package,
          },
          {
            title: 'Repartidores',
            description: 'Administrá repartidores y su disponibilidad.',
            icon: Truck,
          },
          {
            title: 'Control logístico',
            description: 'Centralizá las operaciones de tu plataforma.',
            icon: ShieldCheck,
          },
        ].map((item) => {
          const Icon = item.icon

          return (
            <Paper
              key={item.title}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'all 180ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'secondary.main',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  bgcolor: '#E8FCEF',
                  color: '#18834B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={25} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {item.title}
              </Typography>

              <Typography color="text.secondary" variant="body2">
                {item.description}
              </Typography>
            </Paper>
          )
        })}
      </Box>
    </Box>
  )
}
