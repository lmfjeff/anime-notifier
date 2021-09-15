import { Image } from '@chakra-ui/image'
import { Input } from '@chakra-ui/input'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import React from 'react'
import { SettingPanel } from '../../components/SettingPanel'

Account.getTitle = '設定'

export default function Account() {
  const [session] = useSession()
  // user.name, image, expires, userId

  if (!session)
    return (
      <Flex h="full" justifyContent="center" alignItems="center">
        <Text alignSelf="center">請登入</Text>
      </Flex>
    )

  const AccountInfoPanel = () => {
    return (
      <Flex justifyContent="center" alignItems="center">
        <Flex flexDir="column" w="300px" p={5}>
          <Box mb={5}>
            <Text mb={2}>連結的 Google 電郵:</Text>
            <Input value={session.user?.email || ''} bg="white" isDisabled _disabled={{}} />
          </Box>
        </Flex>
      </Flex>
    )
  }

  return (
    <SettingPanel>
      <AccountInfoPanel />
    </SettingPanel>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  return {
    props: { session },
  }
}
