import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            LogiTrack
          </Typography>
          <Button color="inherit" component={RouterLink} to="/login">
            Ingresar
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
