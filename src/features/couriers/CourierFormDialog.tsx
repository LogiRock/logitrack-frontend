import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toApiError } from '../../api/apiError'
import { useNotify } from '../../components/NotificationProvider'
import { couriersApi, type EstadoRepartidor, type RepartidorResponseDto } from './api'

const createSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  tipoVehiculo: z.string().trim().min(1, 'El tipo de vehículo es obligatorio'),
  estado: z.enum(['ACTIVO', 'INACTIVO']),
  username: z
    .string()
    .trim()
    .min(1, 'El nombre de usuario es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'Máximo 72 caracteres'),
})

const editSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  tipoVehiculo: z.string().trim().min(1, 'El tipo de vehículo es obligatorio'),
})

type FormValues = {
  nombre: string
  tipoVehiculo: string
  estado: EstadoRepartidor
  username: string
  password: string
}

interface CourierFormDialogProps {
  open: boolean
  courier: RepartidorResponseDto | null
  onClose: () => void
  onSaved: () => void
}

export function CourierFormDialog({ open, courier, onClose, onSaved }: CourierFormDialogProps) {
  const isEdit = Boolean(courier)
  const notify = useNotify()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema) as never,
    defaultValues: {
      nombre: '',
      tipoVehiculo: '',
      estado: 'ACTIVO',
      username: '',
      password: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        nombre: courier?.nombre ?? '',
        tipoVehiculo: courier?.tipoVehiculo ?? '',
        estado: courier?.estado ?? 'ACTIVO',
        username: '',
        password: '',
      })
    }
  }, [open, courier, reset])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && courier) {
        await couriersApi.actualizar(courier.id, {
          nombre: values.nombre,
          tipoVehiculo: values.tipoVehiculo,
        })
        notify.success('Repartidor actualizado correctamente')
      } else {
        await couriersApi.crear({
          nombre: values.nombre,
          tipoVehiculo: values.tipoVehiculo,
          estado: values.estado,
          username: values.username,
          password: values.password,
        })
        notify.success('Repartidor registrado correctamente')
      }
      onSaved()
      onClose()
    } catch (err) {
      const apiErr = toApiError(err)
      if (apiErr.status === 400 && apiErr.errores) {
        for (const [field, message] of Object.entries(apiErr.errores)) {
          if (field in values) {
            setError(field as keyof FormValues, { type: 'server', message })
          }
        }
      }
      notify.error(apiErr.mensaje)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{isEdit ? 'Editar repartidor' : 'Nuevo repartidor'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Nombre completo"
              fullWidth
              {...register('nombre')}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre?.message}
            />
            <TextField
              label="Tipo de vehículo"
              placeholder="Ej: Moto, Camioneta, Bicicleta"
              fullWidth
              {...register('tipoVehiculo')}
              error={Boolean(errors.tipoVehiculo)}
              helperText={errors.tipoVehiculo?.message}
            />

            {!isEdit && (
              <>
                <TextField
                  select
                  label="Estado inicial"
                  defaultValue="ACTIVO"
                  fullWidth
                  {...register('estado')}
                  error={Boolean(errors.estado)}
                  helperText={errors.estado?.message}
                >
                  <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                  <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                </TextField>

                <TextField
                  label="Nombre de usuario"
                  fullWidth
                  {...register('username')}
                  error={Boolean(errors.username)}
                  helperText={errors.username?.message}
                />

                <TextField
                  label="Contraseña"
                  type="password"
                  fullWidth
                  {...register('password')}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Registrar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
