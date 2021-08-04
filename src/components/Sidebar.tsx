import { Button, Flex, VStack } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'

export const Sidebar = () => {
  return (
    <Flex flexDirection="column" style={{ border: 'solid', borderColor: 'black', borderWidth: '1px' }}>
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
      <Button>Logout</Button>
    </Flex>
  )
}
