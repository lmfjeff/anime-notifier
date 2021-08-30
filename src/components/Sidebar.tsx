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
          <Button colorScheme="blue">Home</Button>
        </Link>
        <Button>Setting</Button>
        <Button>Profile</Button>
        <Button>Notification</Button>
        <Link href="/following" passHref>
          <Button colorScheme="blue">List</Button>
        </Link>
        <Link href="/anime/season" passHref>
          <Button colorScheme="blue">Anime</Button>
        </Link>
        <Link href="/anime/season/2021/summer" passHref>
          <Button colorScheme="blue">Explore</Button>
        </Link>
        <Button>User</Button>
        <Button>Theme</Button>
        <Button>Help</Button>
        <Link href="/signin" passHref>
          <Button colorScheme="blue">Sign In</Button>
        </Link>
        {session && (
          <Button colorScheme="blue" onClick={() => signOut()}>
            Sign Out
          </Button>
        )}
        {session && (
          <Link href="/admin" passHref>
            <Button colorScheme="blue">Admin</Button>
          </Link>
        )}
        <Button colorScheme="blue" onClick={() => fetch('/api/hello')}>
          Test
        </Button>
      </>
    </Flex>
  )
}
