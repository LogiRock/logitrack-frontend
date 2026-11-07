/** MODAL DE DETALLE DE HISTORIAL
 * Muestra los datos del envío, direcciones, repartidor asignado
 * y el historial de estados (GET /envios/{id}/historial) */

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
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toApiError } from '../../api/apiError'
import { useNotify } from '../../components/NotificationProvider'
import { type EnvioResponseDto, type HistorialEstadoEnvioResponseDto, shipmentsApi } from './api'

interface ShipmentDetailDialogProps {
  shipment: EnvioResponseDto | null
  onClose: () => void
}

function formatDireccion(d: EnvioResponseDto['origen']) {
  return `${d.calle} ${d.numero}, ${d.ciudad} (CP ${d.codigoPostal})`
}

export function ShipmentDetailDialog({ shipment, onClose }: ShipmentDetailDialogProps) {
  const [historial, setHistorial] = useState<HistorialEstadoEnvioResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const notify = useNotify()

  useEffect(() => {
    if (!shipment) return

    let active = true
    setLoading(true)
    setHistorial([])

    shipmentsApi
      .consultarHistorial(shipment.id)
      .then((data) => {
        if (active) setHistorial(data)
      })
      .catch((err) => {
        if (active) notify.error(toApiError(err).mensaje)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [shipment, notify])

  return (
    <Dialog open={Boolean(shipment)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Detalle del envío {shipment?.codigoSeguimiento}</DialogTitle>
      <DialogContent>
        {shipment && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Chip label={shipment.estado} color="primary" size="small" />
              <Typography variant="body2" color="text.secondary">
                Cliente: <strong>{shipment.clienteNombre}</strong>
              </Typography>
            </Stack>

            <Typography variant="body2">
              <strong>Paquete:</strong> {shipment.peso} kg — {shipment.ancho} × {shipment.alto} ×{' '}
              {shipment.largo} cm
            </Typography>

            <Typography variant="body2">
              <strong>Origen:</strong> {formatDireccion(shipment.origen)}
            </Typography>

            <Typography variant="body2">
              <strong>Destino:</strong> {formatDireccion(shipment.destino)}
            </Typography>

            <Typography variant="body2">
              <strong>Repartidor asignado:</strong>{' '}
              {shipment.courierId ?? 'Sin repartidor asignado'}
            </Typography>

            <Divider />

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Historial de estados
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            ) : historial.length === 0 ? (
              <Alert severity="info">Sin cambios de estado registrados.</Alert>
            ) : (
              <List dense disablePadding>
                {historial.map((item) => (
                  <ListItem key={item.idHistorial} divider>
                    <ListItemText
                      primary={`${item.estadoAnterior ?? 'INICIO'} → ${item.estadoNuevo}`}
                      secondary={item.fechaCambio}
                    />
                  </ListItem>
                ))}
              </List>
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
