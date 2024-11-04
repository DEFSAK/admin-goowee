import axios from 'axios'
import { BinaryLike, createHash, randomBytes } from 'crypto'
import { BrowserWindow, IpcMain, safeStorage } from 'electron'
import {
  AccessToken,
  AuthorizationCode,
  AuthorizationTokenConfig,
  ModuleOptions,
  Token
} from 'simple-oauth2'

//#region Interfaces
interface AuthURL {
  redirect_uri: string
  scope: string
  state: string
  code_challenge: string
  code_challenge_method: string
}

export interface AuthLoginResponse {
  url: string
  code_verifier: string
  state: string
}
//#endregion

//#region Config
const AuthRedirectURI = 'admingoowee://callback'
const AuthConfig: ModuleOptions = {
  client: {
    id: '3e06062b-6481-4285-ae06-76fa0e97289e',
    secret: ''
  },
  auth: {
    tokenHost: 'https://chivvyusers.b2clogin.com',
    authorizePath: '/chivvyusers.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN/oauth2/v2.0/authorize',
    tokenPath: '/chivvyusers.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN/oauth2/v2.0/token'
  },
  options: {
    bodyFormat: 'form',
    authorizationMethod: 'body'
  }
}
//#endregion

//#region Helpers
const sha256 = (buffer: BinaryLike): Buffer => {
  return createHash('sha256').update(buffer).digest()
}

const base64URLEncode = (buffer: Buffer): string => {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const CodeVerifier = (): string => {
  return base64URLEncode(randomBytes(32))
}

const CodeChallenge = (code_verifier: string): string => {
  return base64URLEncode(sha256(code_verifier))
}

const Encrypt = (text: string): string => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('safeStorage encryption is not available')
  }

  return safeStorage.encryptString(text).toString('base64')
}

const Decrypt = (text: string): string => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('safeStorage encryption is not available')
  }

  return safeStorage.decryptString(Buffer.from(text, 'base64'))
}

const GetMainWindow = (): BrowserWindow | null => {
  const ID = parseInt(process.env.MAIN_WINDOW_ID as string)
  try {
    return BrowserWindow.fromId(ID)
  } catch (error) {
    console.error('Error getting main window: ', error)
    return null
  }
}
//#endregion

//#region Auth
const AuthClient = new AuthorizationCode(AuthConfig)
let ActiveToken: AccessToken | null = null
let RefreshLoopStarted: boolean = false

const AuthLogin = (): AuthLoginResponse => {
  const code_verifier = CodeVerifier()
  const code_challenge = CodeChallenge(code_verifier)
  const state = base64URLEncode(randomBytes(32))

  const url = AuthClient.authorizeURL({
    redirect_uri: AuthRedirectURI,
    scope: `offline_access ${AuthConfig.client.id}`,
    state,
    code_challenge,
    code_challenge_method: 'S256'
  } as AuthURL)

  return { url, code_verifier, state }
}

const ExchangeToken = async (params: AuthorizationTokenConfig): Promise<AccessToken | null> => {
  params.redirect_uri = AuthRedirectURI

  try {
    const Token = await AuthClient.getToken(params)
    ActiveToken = Token
    if (!RefreshLoopStarted) {
      StartRefreshLoop()
    }
    return Token
  } catch (error) {
    console.error('Error exchanging token: ', error)
    return null
  }
}

const LoadStoredToken = async (EncryptedToken: string): Promise<AccessToken | null> => {
  try {
    const DecryptedToken = Decrypt(EncryptedToken)
    const ParsedToken = JSON.parse(DecryptedToken)
    ActiveToken = AuthClient.createToken(ParsedToken)
    if (!RefreshLoopStarted) {
      StartRefreshLoop()
    }
    return ActiveToken
  } catch (error) {
    console.error('Error loading stored token: ', error)
    return null
  }
}

export const RefreshToken = async (refresh_token: string): Promise<AccessToken | null> => {
  const token_params = {
    grant_type: 'refresh_token',
    refresh_token,
    client_id: AuthConfig.client.id
  }

  try {
    const response = await axios.post(
      `${AuthConfig.auth.tokenHost}${AuthConfig.auth.tokenPath}`,
      token_params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (response.data) {
      const Token = AuthClient.createToken(response.data)
      ActiveToken = Token
      return Token
    }
  } catch (error) {
    console.error('Error refreshing token: ', error)
    return null
  }

  return null
}

const StartRefreshLoop = (): void => {
  if (RefreshLoopStarted) return
  RefreshLoopStarted = true

  const mainWindow = GetMainWindow()
  if (!mainWindow) return

  if (!ActiveToken) return
  let Token = (ActiveToken.token.token ? ActiveToken.token.token : ActiveToken.token) as Token
  let IsExpired = (Token.expires_on as number) - Math.floor(Date.now() / 1000)

  let RefreshTokenExpiresOn =
    (Token.not_before as number) + (Token.refresh_token_expires_in as number)
  let IsValidRefreshToken = RefreshTokenExpiresOn > Math.floor(Date.now() / 1000)

  const doRefresh = async (): Promise<void> => {
    if (!ActiveToken || !mainWindow) return

    if (!IsValidRefreshToken) {
      console.log('Refresh Token Expired')
      mainWindow.webContents.send('force-logout')
      return
    } else if (IsExpired <= 0) {
      console.log('Refreshing Access Token')
      ActiveToken = await RefreshToken(Token.refresh_token as string)
      if (ActiveToken) {
        console.log('Access Token Refreshed')
        console.log(ActiveToken)
        mainWindow.webContents.send('token-refresh', ActiveToken)

        Token = (ActiveToken.token.token ? ActiveToken.token.token : ActiveToken.token) as Token
        IsExpired = (Token.expires_on as number) - Math.floor(Date.now() / 1000)
        RefreshTokenExpiresOn =
          (Token.not_before as number) + (Token.refresh_token_expires_in as number)
        IsValidRefreshToken = RefreshTokenExpiresOn > Math.floor(Date.now() / 1000)
      }
    }
  }

  doRefresh()
  setInterval(doRefresh, 10000)
}
//#endregion

//#region IPC
export default (ipc: IpcMain): void => {
  ipc.handle('AuthLogin', async () => {
    return AuthLogin()
  })

  ipc.handle('ExchangeToken', async (_, params: AuthorizationTokenConfig) => {
    return ExchangeToken(params)
  })

  ipc.handle('Encrypt', async (_, text: string) => {
    return Encrypt(text)
  })

  ipc.handle('LoadStoredToken', async (_, EncryptedToken: string) => {
    return LoadStoredToken(EncryptedToken)
  })
}
//#endregion
