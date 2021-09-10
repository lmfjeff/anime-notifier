import { Button } from '@chakra-ui/button'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { Switch } from '@chakra-ui/switch'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import React, { useCallback, useEffect, useState } from 'react'
import { SettingPanel } from '../../components/SettingPanel'
import * as swHelper from '../../utils/swHelper'

Notification.getTitle = '設定'

export default function Notification() {
  const [session] = useSession()

  const [isSubscribed, setIsSubscribed] = useState(false)
  const [sub, setSub] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  const updateSub = async (sub: string) => {
    const resp = await axios.post('/api/setting', { sub })
    console.log(resp)
  }

  useEffect(() => {
    async function checkSub() {
      const subscription = await swHelper.checkSubscription()
      setIsSubscribed(!!subscription)
      setSub(subscription || null)
      // const resp = await axios.get('/api/setting')
      // console.log(resp.data?.sub)
      setInitializing(false)
    }
    checkSub()
  }, [])

  const handleToggle = useCallback(async () => {
    setLoading(true)
    if (isSubscribed) {
      await swHelper.unsubscribe()
      await updateSub('')
      setIsSubscribed(false)
      setSub(null)
    } else {
      const sub = await swHelper.subscribe()
      await updateSub(JSON.stringify(sub))
      setIsSubscribed(true)
      setSub(sub)
    }
    setLoading(false)
  }, [isSubscribed])

  const sendTestNotification = async (event: any) => {
    event.preventDefault()
    await swHelper.testNotification()
  }

  const NotificationPanel = () => {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Flex flexDir="column" w="300px" p={5}>
          {!initializing ? (
            <>
              <Box mb={5}>
                <Text mb={2}>Enable Notification:</Text>
                <Switch
                  aria-label="Enable Notification"
                  // defaultChecked={isSubscribed}
                  isChecked={isSubscribed}
                  onChange={() => {
                    handleToggle()
                  }}
                  isDisabled={loading}
                />
                {loading && <Spinner />}
              </Box>
              {/* <Button onClick={() => console.log(sub)}>see sub</Button>
              <Button onClick={() => console.log(isSubscribed)}>see issub</Button> */}
              <Box mb={5}>
                <Text mb={2}>Test:</Text>
                <Button onClick={sendTestNotification} colorScheme="blue" isDisabled={!isSubscribed}>
                  Send Test Notification
                </Button>
              </Box>
            </>
          ) : (
            <Spinner />
          )}
        </Flex>
      </Flex>
    )
  }

  if (!session)
    return (
      <Flex h="full" justifyContent="center" alignItems="center">
        <Text alignSelf="center">請登入</Text>
      </Flex>
    )

  return (
    <SettingPanel>
      <NotificationPanel />
    </SettingPanel>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  return {
    props: { session },
  }
}
