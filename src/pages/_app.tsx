import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Layout } from '../components/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider as AuthProvider } from 'next-auth/client'
import { ProgressBar } from '../components/ProgressBar'
import { ReactElement, ReactNode, useEffect } from 'react'
import * as swHelper from '../utils/swHelper'
import { NextPage } from 'next'

type NextPageWithLayout = NextPage & {
  getTitle: string
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = new QueryClient()
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
  const getLayout = (page: ReactElement) => {
    return <Layout title={Component.getTitle}>{page}</Layout>
  }
  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider session={pageProps.session}>
          <ProgressBar />
          {/* <Layout title="hahaTitles">
            <Component {...pageProps} />
          </Layout> */}
          {getLayout(<Component {...pageProps} />)}
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}
