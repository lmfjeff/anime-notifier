import { Button } from '@chakra-ui/button'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Textarea } from '@chakra-ui/textarea'
import axios from 'axios'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import * as swHelper from '../utils/swHelper'

const Notification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [sub, setSub] = useState<any>(null)

  const updateSub = async (sub: string) => {
    const resp = await axios.post('/api/setting', { sub })
    console.log(resp)
  }

  useEffect(() => {
    async function a() {
      setIsSubscribed(!!(await swHelper.checkSubscription()))
      // console.log(await swHelper.checkSubscription())
      setSub((await swHelper.checkSubscription()) || null)

      const resp = await axios.get('/api/setting')
      console.log(resp.data?.sub)
    }
    a()
  }, [])

  const subscribeButtonOnClick = async (event: any) => {
    event.preventDefault()
    const sub = await swHelper.subscribe()
    await updateSub(JSON.stringify(sub))
    setIsSubscribed(true)
  }

  const unsubscribeButtonOnClick = async (event: any) => {
    event.preventDefault()
    await swHelper.unsubscribe()
    await updateSub('')
    setIsSubscribed(false)
  }

  const sendNotificationButtonOnClick = async (event: any) => {
    event.preventDefault()
    await swHelper.testNotification()
  }

  return (
    <Flex flexDir="column" w={600}>
      <Button onClick={subscribeButtonOnClick} disabled={isSubscribed}>
        Subscribe
      </Button>
      <Button onClick={unsubscribeButtonOnClick} disabled={!isSubscribed}>
        Unsubscribe
      </Button>
      <Button onClick={sendNotificationButtonOnClick} disabled={!isSubscribed}>
        Send Notification
      </Button>
      <Textarea readOnly value={JSON.stringify(sub, null, 2)} h={600}></Textarea>
    </Flex>
  )
}

export default Notification
