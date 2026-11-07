/**  Registro público de Cliente desde el Login*/

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toApiError } from '../../api/apiError'
import { useNotify } from '../../components/NotificationProvider'
import { type RegistroClienteRequestDto, shipmentsApi } from './api'

const registerSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  email: z
    .string()
    .trim()
    .min(1, 'El email es obligatorio')
    .email('El formato del email no es válido'),
  telefono: z.string().trim().min(1, 'El teléfono es obligatorio'),
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

interface RegisterClientDialogProps {
  open: boolean
  onClose: () => void
}

export function RegisterClientDialog({ open, onClose }: RegisterClientDialogProps) {
  const notify = useNotify()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistroClienteRequestDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nombre: '', email: '', telefono: '', username: '', password: '' },
  })

  useEffect(() => {
    if (open) {
      reset({ nombre: '', email: '', telefono: '', username: '', password: '' })
    }
  }, [open, reset])

  const onSubmit = async (values: RegistroClienteRequestDto) => {
    try {
      await shipmentsApi.registrarCliente(values)
      notify.success('Cuenta de cliente creada. Ya podés iniciar sesión.')
      onClose()
    } catch (err) {
      const apiErr = toApiError(err)
      if (apiErr.status === 400 && apiErr.errores) {
        for (const [field, message] of Object.entries(apiErr.errores)) {
          if (field in values) {
            setError(field as keyof RegistroClienteRequestDto, { type: 'server', message })
          }
        }
      }
      notify.error(apiErr.mensaje)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>Registrarse como cliente</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre completo"
              fullWidth
              {...register('nombre')}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre?.message}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label="Teléfono"
              fullWidth
              {...register('telefono')}
              error={Boolean(errors.telefono)}
              helperText={errors.telefono?.message}
            />
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Registrarme
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
