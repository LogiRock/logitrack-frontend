
/** PANTALLA PRINCIPAL DE REPARTIDORES */

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { toApiError } from '../../api/apiError'
import { useNotify } from '../../components/NotificationProvider'
import { couriersApi, type RepartidorResponseDto } from './api'
import { CourierDetailDialog } from './CourierDetailDialog'
import { CourierFormDialog } from './CourierFormDialog'

export function CouriersListPage() {
  const [couriers, setCouriers] = useState<RepartidorResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCourier, setEditingCourier] = useState<RepartidorResponseDto | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deletingCourier, setDeletingCourier] = useState<RepartidorResponseDto | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const notify = useNotify()

  const loadCouriers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await couriersApi.listar()
      setCouriers(data)
    } catch (err) {
      notify.error(toApiError(err).mensaje)
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    loadCouriers()
  }, [loadCouriers])

  const handleToggleEstado = async (courier: RepartidorResponseDto) => {
    const nuevoEstado = courier.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
    setBusyId(courier.id)
    try {
      const updated = await couriersApi.cambiarEstado(courier.id, { estado: nuevoEstado })
      setCouriers((prev) => prev.map((c) => (c.id === courier.id ? updated : c)))
      notify.success(`Estado actualizado a ${nuevoEstado}`)
    } catch (err) {
      notify.error(toApiError(err).mensaje)
    } finally {
      setBusyId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingCourier) return
    setBusyId(deletingCourier.id)
    try {
      await couriersApi.eliminar(deletingCourier.id)
      setCouriers((prev) => prev.filter((c) => c.id !== deletingCourier.id))
      notify.success('Repartidor eliminado correctamente')
      setDeletingCourier(null)
    } catch (err) {
      notify.error(toApiError(err).mensaje)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Repartidores
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setEditingCourier(null)
            setFormOpen(true)
          }}
        >
          Nuevo repartidor
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell align='center'>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {couriers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    No hay repartidores registrados.
                  </TableCell>
                </TableRow>
              ) : (
                couriers.map((courier) => (
                  <TableRow key={courier.id}>
                    <TableCell>{courier.nombre}</TableCell>
                    <TableCell>{courier.tipoVehiculo}</TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Chip
                          label={courier.estado}
                          color={courier.estado === 'ACTIVO' ? 'success' : 'default'}
                          size="small"
                        />
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => setDetailId(courier.id)}
                        >
                          Detalle
                        </Button>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setEditingCourier(courier)
                            setFormOpen(true)
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          disabled={busyId === courier.id}
                          onClick={() => handleToggleEstado(courier)}
                        >
                          {courier.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          disabled={busyId === courier.id}
                          onClick={() => setDeletingCourier(courier)}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CourierFormDialog
        open={formOpen}
        courier={editingCourier}
        onClose={() => setFormOpen(false)}
        onSaved={loadCouriers}
      />

      <CourierDetailDialog courierId={detailId} onClose={() => setDetailId(null)} />

      <Dialog open={Boolean(deletingCourier)} onClose={() => setDeletingCourier(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás segura de que querés eliminar al repartidor{' '}
            <strong>{deletingCourier?.nombre}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingCourier(null)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={Boolean(busyId)}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
