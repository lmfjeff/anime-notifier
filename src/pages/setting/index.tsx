import { Input } from '@chakra-ui/input'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import React from 'react'
import { HtmlHead } from '../../components/HtmlHead'
import { SettingPanelTab } from '../../components/SettingPanelTab'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  return {
    props: { session },
  }
}

Account.getTitle = '設定'

export default function Account() {
  const { data: session } = useSession()

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
      <Flex flexDir="column" alignItems={'center'} gap={3}>
        <Flex w="300px" flexDir="column" gap={3}>
          <Text>連結的 Google 電郵:</Text>
          <Input defaultValue={session?.user?.email || '無'} bg="white" isDisabled _disabled={{}} />
        </Flex>
      </Flex>
    </>
  )
}
