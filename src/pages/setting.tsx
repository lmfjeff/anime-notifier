import React from 'react'
import { getSession, signIn, signOut, useSession } from 'next-auth/client'
import { Button, Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Text, Image } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

export default function Signin() {
  const [session] = useSession()

  const AccountInfoPanel = () => {
    return (
      <>
        {session && (
          <Flex flexDir="column">
            <Text fontSize="2xl" mb={5}>
              Google Linked Account
            </Text>
            <Text>Email: {session.user?.email || 'null'}</Text>
            <Text>Name: {session.user?.name || 'null'}</Text>
            <Text>Image:</Text>
            <Image src={session.user?.image || ''} alt="" width={10} />
            <Text>Session Expiration: {session.expires || 'null'}</Text>
            <Text>Session Expiration: {session.userId || 'null'}</Text>
          </Flex>
        )}
      </>
    )
  }
  // if (typeof window !== 'undefined' && loading) return null

  return (
    <>
      <Tabs>
        <TabList>
          <Tab>Account</Tab>
          <Tab>Notification</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AccountInfoPanel />
          </TabPanel>
          <TabPanel>
            <p>Notification function under development</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  return {
    props: { session },
  }
}
