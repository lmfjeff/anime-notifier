import { Button, Flex, FlexProps, Spacer } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/client'
import axios from 'axios'
import { useRouter } from 'next/router'

type Props = FlexProps & {
  handleToggle?: () => void
  isOpen?: boolean
}

export const Sidebar = (props: Props) => {
  const { handleToggle, isOpen, ...rest } = props
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
        onClick={handleToggle ? () => handleToggle() : () => {}}
      >
        {text}
      </Button>
    </Link>
  )
  return (
    <Flex flexDirection="column" bg="#eaeaea" w={180} flexShrink={0} zIndex="modal" {...rest}>
      <Button as="b">Anime Notifier</Button>
      <SidebarButton url="/anime/season" text="番表" />
      <SidebarButton url="/signin" text="登入" />
      <Spacer />
      {session && (
        <>
          <SidebarButton url="/following" text="追蹤" />
          <SidebarButton url="/admin" text="Admin" />
          <Button onClick={() => signOut()}>登出</Button>
          <SidebarButton url="/home" text="Home" />
          <Button onClick={() => console.log()}>Test</Button>
          <Button>Setting</Button>
          <Button>Profile</Button>
          <Button>Notification</Button>
          <Button>User</Button>
          <Button>Theme</Button>
          <Button>Help</Button>
        </>
      )}
    </Flex>
  )
}
