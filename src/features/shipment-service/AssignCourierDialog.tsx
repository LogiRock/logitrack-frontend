/** Carga los repartidores desde couriersApi.listar(),
 * filtra los ACTIVO y llama a PUT /envios/{id}/courier/{courierId}.
 * Si courier-service está apagado, muestra el aviso 503 con notify.error(...)
 * y la pantalla sigue usable */

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toApiError } from '../../api/apiError'
import { useNotify } from '../../components/NotificationProvider'
import { couriersApi, type RepartidorResponseDto } from '../couriers/api'
import { type EnvioResponseDto, shipmentsApi } from './api'

interface AssignCourierDialogProps {
  shipment: EnvioResponseDto | null
  onClose: () => void
  onAssigned: () => void
}

export function AssignCourierDialog({ shipment, onClose, onAssigned }: AssignCourierDialogProps) {
  const [couriers, setCouriers] = useState<RepartidorResponseDto[]>([])
  const [selectedCourierId, setSelectedCourierId] = useState('')
  const [loadingCouriers, setLoadingCouriers] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const notify = useNotify()

  useEffect(() => {
    if (!shipment) return

    let active = true
    setLoadingCouriers(true)
    setLoadError(null)
    setSelectedCourierId(shipment.courierId ?? '')

    couriersApi
      .listar()
      .then((list) => {
        if (!active) return
        const activos = list.filter((c) => c.estado === 'ACTIVO')
        setCouriers(activos)
      })
      .catch((err) => {
        if (!active) return
        const apiErr = toApiError(err)
        setLoadError(apiErr.mensaje)
        notify.error(apiErr.mensaje)
      })
      .finally(() => {
        if (active) setLoadingCouriers(false)
      })

    return () => {
      active = false
    }
  }, [shipment, notify])

  const handleAssign = async () => {
    if (!shipment || !selectedCourierId) return
    setSubmitting(true)
    try {
      await shipmentsApi.asignarCourier(shipment.id, selectedCourierId)
      notify.success('Repartidor asignado correctamente')
      onAssigned()
      onClose()
    } catch (err) {
      notify.error(toApiError(err).mensaje)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={Boolean(shipment)} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Asignar repartidor</DialogTitle>
      <DialogContent>
        {loadingCouriers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Envío: <strong>{shipment?.codigoSeguimiento}</strong>
            </Typography>

            {loadError ? (
              <Alert severity="error">{loadError}</Alert>
            ) : couriers.length === 0 ? (
              <Alert severity="warning">No hay repartidores activos disponibles.</Alert>
            ) : (
              <TextField
                select
                label="Repartidor disponible"
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(e.target.value)}
                fullWidth
              >
                {couriers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre} ({c.tipoVehiculo})
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={submitting || loadingCouriers || !selectedCourierId}
        >
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
