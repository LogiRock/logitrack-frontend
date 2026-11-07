import { Alert, AlertTitle, Box, Button, Container } from '@mui/material'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: '',
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Error inesperado al renderizar la interfaz.',
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, info)
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' })
    window.location.assign('/')
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Alert severity="error" variant="outlined">
            <AlertTitle>Algo salió mal en la pantalla</AlertTitle>
            {this.state.errorMessage}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="error" size="small" onClick={this.handleReset}>
                Volver al inicio
              </Button>
            </Box>
          </Alert>
        </Container>
      )
    }

    return this.props.children
  }
}
