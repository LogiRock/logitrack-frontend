import { Paper, Typography } from '@mui/material'

// El formulario real lo implementa M1.
export function LoginPage() {
  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5">Iniciar sesión</Typography>
    </Paper>
  )
}
