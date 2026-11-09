import {
  Alert,
  type AlertColor,
  Snackbar,
} from '@mui/material'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface NotificationContextValue {
  success: (message: string) => void
  warning: (message: string) => void
  error: (message: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('info')

  const show = useCallback((type: AlertColor, msg: string) => {
    setSeverity(type)
    setMessage(msg)
    setOpen(true)
  }, [])

  // Escucha los errores globales de autenticación generados por Axios.
  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>
      show('error', customEvent.detail.message)
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [show])

  const value = useMemo<NotificationContextValue>(
    () => ({
      success: (msg) => show('success', msg),
      warning: (msg) => show('warning', msg),
      error: (msg) => show('error', msg),
    }),
    [show],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4500}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export function useNotify(): NotificationContextValue {
  const ctx = useContext(NotificationContext)

  if (!ctx) {
    throw new Error(
      'useNotify debe utilizarse dentro de un NotificationProvider',
    )
  }

  return ctx
}