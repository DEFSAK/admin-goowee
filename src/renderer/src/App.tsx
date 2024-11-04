import { useAuth } from './components/auth-provider'
import LoginPage from './components/pages/login'
import MainPage from './components/pages/main'
import './global.css'

function App(): JSX.Element {
  const { isAuthenticated } = useAuth()
  return <div className="overflow-clip">{isAuthenticated ? <MainPage /> : <LoginPage />}</div>
}

export default App
