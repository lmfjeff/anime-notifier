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
import { NextPage } from 'next'

type NextPageWithLayout = NextPage & {
  getTitle?: string
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = new QueryClient()

  const theme = {
    fonts: {
      body: 'Noto Sans HK',
      heading: 'Noto Sans HK',
      mono: 'Noto Sans HK',
      yomogi: 'Yomogi',
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
          <Layout title={Component.getTitle}>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}
