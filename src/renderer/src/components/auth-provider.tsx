import React, { useState, createContext, useContext, useEffect } from 'react'

interface AuthContextProps {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  token: string | null
}

interface AuthProviderProps {
  children?: React.ReactNode
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)
const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)

  const login = async (): Promise<void> => {
    const { url, code_verifier, state } = await window.electron.ipcRenderer.invoke('AuthLogin')
    window.open(url, '_blank')
    localStorage.setItem('AG_AUTH_pkce_verifier', code_verifier)
    localStorage.setItem('AG_AUTH_state', state)
  }

  const logout = (): void => {
    setIsAuthenticated(false)
    setToken(null)
    localStorage.removeItem('AG_AUTH_token')
    localStorage.removeItem('AG_AUTH_pkce_verifier')
    localStorage.removeItem('AG_AUTH_state')
  }

  const handle_callback = async (url: string): Promise<void> => {
    const code_verifier = localStorage.getItem('AG_AUTH_pkce_verifier')
    const state = localStorage.getItem('AG_AUTH_state')
    if (!code_verifier) return

    const url_obj = new URL(url)
    const code = url_obj.searchParams.get('code')
    const url_state = url_obj.searchParams.get('state')

    if (state !== url_state) {
      console.error('State mismatch')
      return
    }

    if (code) {
      const token_params = {
        code,
        code_verifier
      }

      const Token = await window.electron.ipcRenderer.invoke('ExchangeToken', token_params)
      if (!Token) return

      const EncryptedToken = await window.electron.ipcRenderer.invoke(
        'Encrypt',
        JSON.stringify(Token)
      )
      localStorage.setItem('AG_AUTH_token', EncryptedToken)

      localStorage.removeItem('AG_AUTH_pkce_verifier')
      localStorage.removeItem('AG_AUTH_state')

      setToken(Token.token.access_token)
      setIsAuthenticated(true)
    }
  }

  const load_stored_token = async (): Promise<void> => {
    const EncryptedToken = localStorage.getItem('AG_AUTH_token')
    if (!EncryptedToken) return

    const Token = await window.electron.ipcRenderer.invoke('LoadStoredToken', EncryptedToken)
    if (!Token) return

    setIsAuthenticated(true)
    setToken(Token.token.token.access_token)
  }

  window.electron.ipcRenderer.on('force-logout', () => {
    logout()
  })

  useEffect(() => {
    load_stored_token()

    window.electron.ipcRenderer.on('token-refresh', async (_event, token) => {
      setToken(token.token.acess_token)

      const EncryptedToken = await window.electron.ipcRenderer.invoke(
        'Encrypt',
        JSON.stringify(token)
      )
      localStorage.setItem('AG_AUTH_token', EncryptedToken)
    })

    window.electron.ipcRenderer.on('oauth-request', (_event, url) => {
      handle_callback(url)
    })

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('oauth-request')
      window.electron.ipcRenderer.removeAllListeners('token-refresh')
      window.electron.ipcRenderer.removeAllListeners('force-login')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export default AuthProvider
