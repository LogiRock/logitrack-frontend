
/** PANTALLA PRINCIPAL DE ENVÍOS */

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toApiError } from '../../api/apiError'
import { getCurrentUserRoles } from '../../api/authSession'
import { useNotify } from '../../components/NotificationProvider'
import { type EnvioResponseDto, type EstadoEnvio, shipmentsApi } from './api'
import { AssignCourierDialog } from './AssignCourierDialog'
import { CreateShipmentDialog } from './CreateShipmentDialog'
import { ShipmentDetailDialog } from './ShipmentDetailDialog'

const ESTADO_COLORS: Record<EstadoEnvio, 'warning' | 'info' | 'success' | 'error'> = {
  PENDIENTE: 'warning',
  EN_RUTA: 'info',
  ENTREGADO: 'success',
  CANCELADO: 'error',
}

function getNextTransitions(shipment: EnvioResponseDto): { label: string; next: EstadoEnvio }[] {
  if (shipment.estado === 'PENDIENTE') {
    const actions: { label: string; next: EstadoEnvio }[] = []
    if (shipment.courierId) {
      actions.push({ label: 'Iniciar ruta', next: 'EN_RUTA' })
    }
    actions.push({ label: 'Cancelar', next: 'CANCELADO' })
    return actions
  }
  if (shipment.estado === 'EN_RUTA') {
    return [{ label: 'Marcar entregado', next: 'ENTREGADO' }]
  }
  return []
}

export function ShipmentsListPage() {
  const [shipments, setShipments] = useState<EnvioResponseDto[]>([])
  const [statusFilter, setStatusFilter] = useState<EstadoEnvio | 'TODOS'>('TODOS')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [assigningShipment, setAssigningShipment] = useState<EnvioResponseDto | null>(null)
  const [detailShipment, setDetailShipment] = useState<EnvioResponseDto | null>(null)

  const notify = useNotify()
  const roles = getCurrentUserRoles()
  const isAdmin = roles.includes('ADMIN')
  const isCliente = roles.includes('CLIENTE')
  const isRepartidor = roles.includes('REPARTIDOR')
  const showAllActionsForDemo = roles.length === 0

  const loadShipments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await shipmentsApi.listar()
      setShipments(data)
    } catch (err) {
      notify.error(toApiError(err).mensaje)
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    loadShipments()
  }, [loadShipments])

  const filteredShipments = useMemo(() => {
    if (statusFilter === 'TODOS') return shipments
    return shipments.filter((s) => s.estado === statusFilter)
  }, [shipments, statusFilter])

  const handleChangeEstado = async (shipment: EnvioResponseDto, nextEstado: EstadoEnvio) => {
    setBusyId(shipment.id)
    try {
      await shipmentsApi.cambiarEstado(shipment.id, { estado: nextEstado })
      notify.success(`Envío ${shipment.codigoSeguimiento} actualizado a ${nextEstado}`)
      await loadShipments()
    } catch (err) {
      notify.error(toApiError(err).mensaje)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 3 }}
      >
        <Typography variant="h4" component="h1">
          Envíos
        </Typography>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <TextField
            select
            size="small"
            label="Filtrar por estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EstadoEnvio | 'TODOS')}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
            <MenuItem value="EN_RUTA">EN_RUTA</MenuItem>
            <MenuItem value="ENTREGADO">ENTREGADO</MenuItem>
            <MenuItem value="CANCELADO">CANCELADO</MenuItem>
          </TextField>

          {(isCliente || showAllActionsForDemo) && (
            <Button variant="contained" onClick={() => setCreateOpen(true)}>
              Nuevo envío
            </Button>
          )}
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table
            sx={{
              minWidth: 900,
              tableLayout: 'fixed',
              '& th, & td': {
                verticalAlign: 'middle',
                py: 2,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '13%' }}>Código</TableCell>
                <TableCell sx={{ width: '18%' }}>Cliente</TableCell>
                <TableCell sx={{ width: '23%' }}>Origen → Destino</TableCell>
                <TableCell sx={{ width: '13%' }}>Estado</TableCell>
                <TableCell align="right" sx={{ width: '33%' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    No hay envíos para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => {
                  const transitions =
                    isRepartidor || isAdmin || showAllActionsForDemo
                      ? getNextTransitions(shipment)
                      : []

                  return (
                    <TableRow
                      key={shipment.id}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {shipment.codigoSeguimiento}
                      </TableCell>

                      <TableCell sx={{ overflowWrap: 'anywhere' }}>
                        {shipment.clienteNombre}
                      </TableCell>

                      <TableCell sx={{ overflowWrap: 'anywhere' }}>
                        {shipment.origen.ciudad} → {shipment.destino.ciudad}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={shipment.estado}
                          color={ESTADO_COLORS[shipment.estado]}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, max-content)',
                            justifyContent: 'end',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="info"
                            onClick={() => setDetailShipment(shipment)}
                          >
                            Historial
                          </Button>

                          {(isAdmin || showAllActionsForDemo) &&
                            shipment.estado === 'PENDIENTE' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => setAssigningShipment(shipment)}
                              >
                                {shipment.courierId
                                  ? 'Reasignar repartidor'
                                  : 'Asignar repartidor'}
                              </Button>
                            )}

                          {transitions.map((t) => (
                            <Button
                              key={t.next}
                              size="small"
                              variant="contained"
                              color={t.next === 'CANCELADO' ? 'error' : 'primary'}
                              disabled={busyId === shipment.id}
                              onClick={() => handleChangeEstado(shipment, t.next)}
                            >
                              {t.label}
                            </Button>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateShipmentDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadShipments}
      />

      <AssignCourierDialog
        shipment={assigningShipment}
        onClose={() => setAssigningShipment(null)}
        onAssigned={loadShipments}
      />

      <ShipmentDetailDialog
        shipment={detailShipment}
        onClose={() => setDetailShipment(null)}
      />
    </Box>
  )
}
