import Background from '../../assets/login_bg.webp'
import { useAuth } from '../auth-provider'
import '../../global.css'

function LoginPage(): JSX.Element {
  const { login } = useAuth()

  return (
    <div className="bg-gray-900 h-screen flex items-center justify-center">
      <section>
        <div className="relative">
          <div
            className="absolute m-auto blur-[160px] max-w-s h-[13rem] top-12 inset-0"
            style={{
              background:
                'linear-gradient(180deg, #7C3AED 0%, rgba(152, 103, 240, 0.984375) 0.01%, rgba(237, 78, 80, 0.2) 100%)'
            }}
          ></div>
          <div className="relative">
            <div className="custom-screen py-28 relative">
              <div className="relative z-10 duration-1000 delay-150 opacity-1">
                <div className="max-w-2xl mx-auto text-center">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-300 via-blue-500 to-sky-300 inline-block text-transparent bg-clip-text">
                    Admin GooWee
                  </h1>
                  <h2 className="text-gray-50 text-2xl font-bold sm:text-2xl mt-2">
                    The SAKxiest Admin GUI for Chivalry 2
                  </h2>
                  <p className="mt-2 text-gray-300">
                    Our app helps Chivalry 2 server admins manage players efficiently. After logging
                    in with Discord OAuth, admins can check player details like platform, alias
                    history, account creation, and ban status. The app also allows kicking or
                    banning players, with global bans adding them to a shared database for easy
                    tracking.
                  </p>
                </div>
                <div className="flex justify-center font-medium text-md">
                  <form className="mt-6 flex flex-col items-center sm:flex-row sm:gap-x-3">
                    <div className="sm:pt-0 pt-3">
                      <a
                        className="py-2.5 px-4 text-center cursor-pointer duration-150 flex items-center justify-center gap-x-1 h-12 text-white bg-[#5865F2] hover:bg-indigo-700 ring-offset-2 ring-blue-600 focus:ring shadow rounded-lg active:bg-indigo-800"
                        onClick={login}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        >
                          <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z"></path>
                        </svg>
                        Sign In with Discord
                      </a>
                    </div>
                  </form>
                </div>
              </div>
              <img
                src={Background}
                width="2880"
                height="1358"
                decoding="async"
                data-nimg="1"
                className="w-full h-full object-cover m-auto absolute inset-0 pointer-events-none"
                loading="lazy"
                style={{ color: 'transparent' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LoginPage
