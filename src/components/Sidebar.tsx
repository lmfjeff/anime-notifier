import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import { getSession, signOut, useSession } from 'next-auth/client'
import { GetServerSideProps } from 'next'
import { Session } from 'next-auth'

export const Sidebar = () => {
  const [session, loading] = useSession()
  return (
    <Flex flexDirection="column" style={{ border: 'solid', borderColor: 'black', borderWidth: '1px' }}>
      <>
        <Link href="/home" passHref>
          <Button>Home</Button>
        </Link>
        <Button>Setting</Button>
        <Button>Profile</Button>
        <Button>Notification</Button>
        <Link href="/anime" passHref>
          <Button>List</Button>
        </Link>
        <Button>Explore</Button>
        <Button>User</Button>
        <Button>Theme</Button>
        <Button>Help</Button>
        <Link href="/signin" passHref>
          <Button>Sign In</Button>
        </Link>
        {session && <Button onClick={() => signOut()}>Sign Out</Button>}
        <Button onClick={() => fetch('/api/hello')}>Test</Button>
      </>
    </Flex>
  )
}
