import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toApiError } from '../../api/apiError'
import { useNotify } from '../../components/NotificationProvider'
import {
  couriersApi,
  type DisponibilidadRepartidorResponseDto,
  type RepartidorResponseDto,
} from './api'

interface CourierDetailDialogProps {
  courierId: string | null
  onClose: () => void
}

export function CourierDetailDialog({ courierId, onClose }: CourierDetailDialogProps) {
  const [courier, setCourier] = useState<RepartidorResponseDto | null>(null)
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadRepartidorResponseDto | null>(
    null,
  )
  const [loading, setLoading] = useState(false)
  const notify = useNotify()

  useEffect(() => {
    if (!courierId) return

    let active = true
    setLoading(true)
    setCourier(null)
    setDisponibilidad(null)

    Promise.all([
      couriersApi.obtenerPorId(courierId),
      couriersApi.consultarDisponibilidad(courierId),
    ])
      .then(([detail, disp]) => {
        if (!active) return
        setCourier(detail)
        setDisponibilidad(disp)
      })
      .catch((err) => {
        if (!active) return
        notify.error(toApiError(err).mensaje)
        onClose()
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [courierId, notify, onClose])

  return (
    <Dialog open={Boolean(courierId)} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Detalle del repartidor</DialogTitle>
      <DialogContent>
        {loading || !courier ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                ID
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {courier.id}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {courier.nombre}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Tipo de vehículo
              </Typography>
              <Typography variant="body1">{courier.tipoVehiculo}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
                Estado operativo
              </Typography>
              <Chip
                label={courier.estado}
                color={courier.estado === 'ACTIVO' ? 'success' : 'default'}
                size="small"
              />
            </Box>

            {disponibilidad && (
              <Alert severity={disponibilidad.disponible ? 'success' : 'warning'}>
                {disponibilidad.disponible
                  ? 'Disponible para recibir envíos.'
                  : `No disponible${disponibilidad.motivo ? `: ${disponibilidad.motivo}` : '.'}`}
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}
