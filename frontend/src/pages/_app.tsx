import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

const NO_NAVBAR_ROUTES = ['/login', '/register', '/oauth/callback']

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const showNavbar = !NO_NAVBAR_ROUTES.includes(router.pathname)

    return (
        <>
            {showNavbar && <Navbar />}
            <Component {...pageProps} />
        </>
    )
}