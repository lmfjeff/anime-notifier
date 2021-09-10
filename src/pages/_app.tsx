import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider as AuthProvider } from 'next-auth/client'
import { ProgressBar } from '../components/ProgressBar'
import { useEffect } from 'react'
import * as swHelper from '../utils/swHelper'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const theme = {
    styles: {
      global: {
        // body: {
        //   overflow: 'hidden',
        // },
      },
    },
  }
  useEffect(() => {
    swHelper.register()
  }, [])
  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider session={pageProps.session}>
          <ProgressBar />
          <Layout title="hahaTitles">
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}
export default MyApp
