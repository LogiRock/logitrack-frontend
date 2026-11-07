import { Box, Button, Paper, Typography } from '@mui/material'
import { useState } from 'react'
import { RegisterClientDialog } from '../features/shipment-service/RegisterClientDialog'

// El formulario real lo implementa M1.
export function LoginPage() {
  const [registerOpen, setRegisterOpen] = useState(false)

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>

      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          ¿Sos cliente nuevo?
        </Typography>
        <Button variant="outlined" fullWidth onClick={() => setRegisterOpen(true)}>
          Crear cuenta de cliente
        </Button>
      </Box>

      <RegisterClientDialog open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </Paper>
  )
}
