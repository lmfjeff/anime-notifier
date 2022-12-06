import { Button } from '@chakra-ui/button'
import { Box, Flex, Text, VStack } from '@chakra-ui/layout'
import { Skeleton } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/spinner'
import { Switch } from '@chakra-ui/switch'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { HtmlHead } from '../../components/HtmlHead'
import { SettingPanelTab } from '../../components/SettingPanelTab'
import * as swHelper from '../../utils/swHelper'
import crypto from 'crypto'
import { Webpush } from '@prisma/client'
import parser from 'ua-parser-js'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  return {
    props: { session },
  }
}

Notification.getTitle = '設定'

export default function Notification() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [loadingToggle, setLoadingToggle] = useState(false)
  const [storedDevice, setStoredDevice] = useState<string | null>(null)

  useEffect(() => {
    // const test = async () => {
    //   const browserSub = await swHelper.checkSubscription()
    //   console.log('browserSub', browserSub?.toJSON())
    // }
    // test()
    setStoredDevice(window.localStorage.getItem('device'))
  }, [])

  const fetchSub = async () => {
    const { data } = await axios.get('/api/setting')
    // console.log('fetch sub data', data)
    return data?.subscriptions
  }

  const deleteSub = async (device: string) => {
    await axios.delete('/api/setting', {
      params: {
        device,
      },
    })
    await queryClient.invalidateQueries('getSub')
  }

  const subscribe = async () => {
    const newSub = await swHelper.subscribe()
    let device
    if (storedDevice) {
      device = storedDevice
    } else {
      device = crypto.randomBytes(20).toString('hex')
      window.localStorage.setItem('device', device)
      setStoredDevice(device)
    }
    const resp = await axios.post('/api/setting', {
      active: true,
      device,
      push_subscription: newSub,
      useragent: window.navigator.userAgent || '',
    })
    await queryClient.invalidateQueries('getSub')
  }

  const handleToggle = async () => {
    setLoadingToggle(true)
    if (deviceSub) {
      await swHelper.unsubscribe()
      if (storedDevice) {
        await deleteSub(storedDevice)
      }
    } else {
      await subscribe()
    }
    setLoadingToggle(false)
  }

  const sendTestNotification = async () => {
    await axios.post('/api/notification', {
      device: storedDevice,
    })
  }

  const { data, isLoading: loadingGetSub } = useQuery('getSub', fetchSub, { enabled: !!session })
  const subscriptions = data as Webpush[]

  const deviceSub = subscriptions?.find(s => s.device === storedDevice)
  const otherDeviceSub = subscriptions?.filter(s => s.device !== storedDevice) || []
  // console.log('otherDeviceSub', otherDeviceSub)

  // todo optimistic update
  // const mutateSub = useMutation(
  //   async sub => {
  //     const { data } = await axios.post('/api/setting', { sub })
  //     return data?.sub || null
  //   },
  //   {
  //     onMutate: async (sub: string | null) => {
  //       await queryClient.cancelQueries('getSub')
  //       const previousSub = queryClient.getQueryData('getSub')
  //       queryClient.setQueryData('getSub', sub)
  //       return { previousSub }
  //     },
  //     onSuccess: (sub, variables, context) => {
  //       queryClient.setQueryData('getSub', sub)
  //     },
  //     onError: (error, variables, context) => {
  //       if (context?.previousSub) {
  //         queryClient.setQueryData('getSub', context.previousSub)
  //       }
  //     },
  //   }
  // )

  if (!session)
    return (
      <Flex h="full" justifyContent="center" alignItems="center">
        <Text alignSelf="center">請登入</Text>
      </Flex>
    )

  return (
    <>
      <HtmlHead title="設定" />
      <SettingPanelTab />
      <Flex flexDir="column" alignItems={'center'}>
        <Skeleton isLoaded={!loadingGetSub} borderRadius={5} w="full" maxW="450px">
          <Text mb={1} textAlign={'center'}>
            本裝置
          </Text>
          <Flex w="full" bg="blue.100" gap={3} py={4} px={2} justify="space-between">
            <Flex gap={3} align={'center'}>
              <Text>允許推送通知:</Text>
              <Switch isChecked={!!deviceSub} onChange={() => handleToggle()} isDisabled={loadingToggle} />
              {loadingToggle && <Spinner size={'sm'} />}
            </Flex>
            <Button onClick={() => sendTestNotification()} colorScheme="blue" isDisabled={!deviceSub}>
              發出測試通知
            </Button>
          </Flex>
        </Skeleton>
        {otherDeviceSub.length > 0 && (
          <Box w="full" maxW="450px" display={'flex'} flexDir="column" alignItems={'center'}>
            <Text mt={4} mb={1}>
              其他推送裝置
            </Text>
            {otherDeviceSub.map(s => {
              const ua = parser(s.useragent)
              const osName = ua.os.name ? `${ua.os.name} ` : ''
              const osVer = ua.os.version ? `${ua.os.version} ` : ''
              const model = ua.device.model ? `(${ua.device.model})` : ''
              const deviceType = osName + osVer + model || '未知裝置'
              const browserName = ua.browser.name ? `${ua.browser.name} ` : ''
              const browserVer = ua.browser.version ? `${ua.browser.version}` : ''
              const browserType = browserName + browserVer || ' '
              return (
                <Box key={s.device} p={2} mb={1} bg="green.200" w="full">
                  <Flex alignItems="center" justifyContent={'space-between'}>
                    <Box>
                      <Text>{deviceType}</Text>
                      <Text whiteSpace={'pre-wrap'}>{browserType}</Text>
                      <Text fontSize={'x-small'} color="grey">
                        Device ID: {s.device}
                      </Text>
                    </Box>
                    <Button
                      onClick={async () => {
                        await deleteSub(s.device)
                      }}
                    >
                      取消推送
                    </Button>
                  </Flex>
                </Box>
              )
            })}
          </Box>
        )}
      </Flex>
    </>
  )
}
