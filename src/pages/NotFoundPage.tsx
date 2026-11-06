import { Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Página no encontrada
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Volver al inicio
      </Button>
    </>
  )
}
