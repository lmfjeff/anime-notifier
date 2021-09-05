import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider as AuthProvider } from 'next-auth/client'
import { ProgressBar } from '../components/ProgressBar'
import { useEffect } from 'react'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope)
          },
          function (err) {
            console.log('Service Worker registration failed: ', err)
          }
        )
      })
    }
  }, [])
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider session={pageProps.session}>
          <ProgressBar />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}
export default MyApp
