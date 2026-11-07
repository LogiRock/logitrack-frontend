/** Valida dimensiones/peso positivos y todos los campos de Direccion (origen y destino)
 * con React Hook Form + Zod */

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toApiError } from '../../api/apiError'
import { useNotify } from '../../components/NotificationProvider'
import { type EnvioRequestDto, shipmentsApi } from './api'

const direccionSchema = z.object({
  calle: z.string().trim().min(1, 'La calle es obligatoria'),
  numero: z.string().trim().min(1, 'El número es obligatorio'),
  ciudad: z.string().trim().min(1, 'La ciudad es obligatoria'),
  codigoPostal: z.string().trim().min(1, 'El código postal es obligatorio'),
})

const positiveNumber = (label: string) =>
  z.coerce
    .number(`${label} es obligatorio` )
    .positive(`${label} debe ser mayor que cero`)

const envioSchema = z.object({
  peso: positiveNumber('El peso'),
  ancho: positiveNumber('El ancho'),
  alto: positiveNumber('El alto'),
  largo: positiveNumber('El largo'),
  origen: direccionSchema,
  destino: direccionSchema,
})

interface CreateShipmentDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

const DEFAULT_VALUES: EnvioRequestDto = {
  peso: 0,
  ancho: 0,
  alto: 0,
  largo: 0,
  origen: { calle: '', numero: '', ciudad: '', codigoPostal: '' },
  destino: { calle: '', numero: '', ciudad: '', codigoPostal: '' },
}

export function CreateShipmentDialog({ open, onClose, onCreated }: CreateShipmentDialogProps) {
  const notify = useNotify()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnvioRequestDto>({
    resolver: zodResolver(envioSchema) as never,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES)
    }
  }, [open, reset])

  const onSubmit = async (values: EnvioRequestDto) => {
    try {
      const created = await shipmentsApi.crear(values)
      notify.success(`Envío ${created.codigoSeguimiento} creado correctamente`)
      onCreated()
      onClose()
    } catch (err) {
      const apiErr = toApiError(err)
      if (apiErr.status === 400 && apiErr.errores) {
        for (const [field, message] of Object.entries(apiErr.errores)) {
          setError(field as keyof EnvioRequestDto, { type: 'server', message })
        }
      }
      notify.error(apiErr.mensaje)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>Nuevo envío</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Dimensiones y peso del paquete
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  label="Peso (kg)"
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  fullWidth
                  {...register('peso')}
                  error={Boolean(errors.peso)}
                  helperText={errors.peso?.message}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  label="Ancho (cm)"
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  fullWidth
                  {...register('ancho')}
                  error={Boolean(errors.ancho)}
                  helperText={errors.ancho?.message}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  label="Alto (cm)"
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  fullWidth
                  {...register('alto')}
                  error={Boolean(errors.alto)}
                  helperText={errors.alto?.message}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  label="Largo (cm)"
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  fullWidth
                  {...register('largo')}
                  error={Boolean(errors.largo)}
                  helperText={errors.largo?.message}
                />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle2" color="text.secondary">
              Dirección de origen
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Calle origen"
                  fullWidth
                  {...register('origen.calle')}
                  error={Boolean(errors.origen?.calle)}
                  helperText={errors.origen?.calle?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Número origen"
                  fullWidth
                  {...register('origen.numero')}
                  error={Boolean(errors.origen?.numero)}
                  helperText={errors.origen?.numero?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Ciudad origen"
                  fullWidth
                  {...register('origen.ciudad')}
                  error={Boolean(errors.origen?.ciudad)}
                  helperText={errors.origen?.ciudad?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Código postal origen"
                  fullWidth
                  {...register('origen.codigoPostal')}
                  error={Boolean(errors.origen?.codigoPostal)}
                  helperText={errors.origen?.codigoPostal?.message}
                />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle2" color="text.secondary">
              Dirección de destino
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Calle destino"
                  fullWidth
                  {...register('destino.calle')}
                  error={Boolean(errors.destino?.calle)}
                  helperText={errors.destino?.calle?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Número destino"
                  fullWidth
                  {...register('destino.numero')}
                  error={Boolean(errors.destino?.numero)}
                  helperText={errors.destino?.numero?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  label="Ciudad destino"
                  fullWidth
                  {...register('destino.ciudad')}
                  error={Boolean(errors.destino?.ciudad)}
                  helperText={errors.destino?.ciudad?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  label="Código postal destino"
                  fullWidth
                  {...register('destino.codigoPostal')}
                  error={Boolean(errors.destino?.codigoPostal)}
                  helperText={errors.destino?.codigoPostal?.message}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Crear envío
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
