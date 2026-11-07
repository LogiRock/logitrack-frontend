import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NotificationProvider } from './components/NotificationProvider'
import { router } from './router'
import { theme } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)
