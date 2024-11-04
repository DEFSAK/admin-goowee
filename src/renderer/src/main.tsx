import { ThemeProvider } from './components/theme-provider'
import AuthProvider from './components/auth-provider'
import { NextUIProvider } from '@nextui-org/react'
import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'
import './global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
