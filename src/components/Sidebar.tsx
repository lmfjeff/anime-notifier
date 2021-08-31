import {
  Box,
  Button,
  ComponentWithAs,
  Flex,
  FlexProps,
  IconButton,
  Spacer,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/client'
import axios from 'axios'
import { useRouter } from 'next/router'

export const Sidebar = (props: any) => {
  const [session, loading] = useSession()
  const router = useRouter()
  const SidebarButton = ({ url, text }: { url: string; text: string }) => (
    <Link href={url} passHref>
      <Button
        as="a"
        isActive={router.asPath.includes(url)}
        borderRadius="none"
        bg="#eaeaea"
        _hover={{ bg: 'blue.200' }}
        _active={{ bg: 'blue.200' }}
      >
        {text}
      </Button>
    </Link>
  )
  return (
    <Flex flexDirection="column" bg="#eaeaea" w={180} flexShrink={0} {...props}>
      <Button as="b">Anime Notifier</Button>
      <SidebarButton url="/anime/season" text="番表" />
      <SidebarButton url="/following" text="追蹤" />
      <SidebarButton url="/signin" text="登入" />
      {session && <SidebarButton url="/admin" text="Admin" />}
      <Spacer />
      {session && <Button onClick={() => signOut()}>Sign Out</Button>}
      <SidebarButton url="/home" text="Home" />
      <Button onClick={() => console.log()}>Test</Button>
      <Button>Setting</Button>
      <Button>Profile</Button>
      <Button>Notification</Button>
      <Button>User</Button>
      <Button>Theme</Button>
      <Button>Help</Button>
    </Flex>
  )
}
