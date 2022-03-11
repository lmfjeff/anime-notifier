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

  const fetchSub = async () => {
    const { data } = await axios.get('/api/setting')
    return data?.sub
  }

  const { data: sub, isLoading: loadingGetSub } = useQuery('getSub', fetchSub, { enabled: !!session })

  const mutateSub = useMutation(
    async sub => {
      const { data } = await axios.post('/api/setting', { sub })
      return data?.sub || null
    },
    {
      onMutate: async (sub: string | null) => {
        await queryClient.cancelQueries('getSub')
        const previousSub = queryClient.getQueryData('getSub')
        queryClient.setQueryData('getSub', sub)
        return { previousSub }
      },
      onSuccess: (sub, variables, context) => {
        queryClient.setQueryData('getSub', sub)
      },
      onError: (error, variables, context) => {
        if (context?.previousSub) {
          queryClient.setQueryData('getSub', context.previousSub)
        }
      },
    }
  )

  const handleToggle = async () => {
    setLoadingToggle(true)
    if (sub) {
      await swHelper.unsubscribe()
      mutateSub.mutate(null)
    } else {
      const newSub = await swHelper.subscribe()
      if (newSub) {
        mutateSub.mutate(JSON.stringify(newSub))
      }
    }
    setLoadingToggle(false)
  }

  const sendTestNotification = async () => {
    await axios.post('/api/notification')
  }

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
        <Skeleton isLoaded={!loadingGetSub} borderRadius={5}>
          <Flex w="250px" flexDir="column" gap={2}>
            <Text>允許推送通知:</Text>
            <Flex gap={3} align={'center'}>
              <div>
                <Switch isChecked={!!sub} onChange={() => handleToggle()} isDisabled={loadingToggle} />
              </div>
              {loadingToggle && <Spinner size={'sm'} />}
            </Flex>
            <Text>測試:</Text>
            <Button onClick={() => sendTestNotification()} colorScheme="blue" isDisabled={!sub}>
              發出測試通知
            </Button>
          </Flex>
        </Skeleton>
      </Flex>
    </>
  )
}
