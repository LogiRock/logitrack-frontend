import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toApiError } from '../../api/apiError'
import { couriersApi, type RepartidorResponseDto } from './api'

export function MyCourierProfilePage() {
  const [profile, setProfile] = useState<RepartidorResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    couriersApi
      .obtenerMiPerfil()
      .then((data) => {
        if (active) setProfile(data)
      })
      .catch((err) => {
        if (active) setErrorMsg(toApiError(err).mensaje)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (errorMsg || !profile) {
    return <Alert severity="error">{errorMsg ?? 'No se pudo cargar tu perfil.'}</Alert>
  }

  return (
    <Box sx={{ maxWidth: 'sm' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mi perfil de repartidor
      </Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="h6">{profile.nombre}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Vehículo asignado
              </Typography>
              <Typography variant="body1">{profile.tipoVehiculo}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
                Estado operativo
              </Typography>
              <Chip
                label={profile.estado}
                color={profile.estado === 'ACTIVO' ? 'success' : 'default'}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
