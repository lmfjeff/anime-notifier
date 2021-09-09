import { Image } from '@chakra-ui/image'
import { Input } from '@chakra-ui/input'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import React from 'react'
import { SettingPanel } from '../../components/SettingPanel'

export default function Account() {
  const [session] = useSession()

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
            <Text mb={2}>Email:</Text>
            <Input value={session.user?.email || ''} bg="white" isDisabled _disabled={{}} />
          </Box>
          {/* <Text>Name: {session.user?.name || 'null'}</Text>
          <Text>Image:</Text>
          <Image src={session.user?.image || ''} alt="" width={10} />
          <Text>Session Expiration: {session.expires || 'null'}</Text>
          <Text>Session Expiration: {session.userId || 'null'}</Text> */}
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
