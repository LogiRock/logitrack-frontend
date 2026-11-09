
import { Alert, TextField, Box, Button, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { toApiError } from '../api/apiError'
import { RegisterClientDialog } from '../features/shipment-service/RegisterClientDialog'

const loginSchema = z.object({
  username: z.string().min(1, 'Ingresá tu usuario'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [registerOpen, setRegisterOpen] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Recupera la ruta solicitada antes de que el usuario fuera enviado al login.
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null)

    try {
      await login(data)
      navigate(from, { replace: true })
    } catch (error) {
      setLoginError(toApiError(error).mensaje)
    }
  }

  // Evita que un usuario autenticado vuelva a la pantalla de login.
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 3 }}
      >
        <TextField
          {...register('username')}
          label="Usuario"
          fullWidth
          margin="normal"
          autoComplete="username"
          error={Boolean(errors.username)}
          helperText={errors.username?.message}
          disabled={isSubmitting}
        />

        <TextField
          {...register('password')}
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          disabled={isSubmitting}
        />

        {loginError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {loginError}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </Box>

      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          ¿Sos cliente nuevo?
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => setRegisterOpen(true)}
          disabled={isSubmitting}
        >
          Crear cuenta de cliente
        </Button>
      </Box>

      <RegisterClientDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </Paper>
  )
}
