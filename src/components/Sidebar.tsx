import { Button, Flex, FlexProps, Progress, Spacer, IconButton } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import React from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/client'
import axios from 'axios'
import { useRouter } from 'next/router'
import { urlAlphabet } from 'nanoid'

type Props = FlexProps & {
  handleToggle?: () => void
  isOpen?: boolean
}

type ButtonProps = {
  url?: string
  text: string
  onClick?: () => void
}

export const Sidebar = (props: Props) => {
  const { handleToggle, isOpen, ...rest } = props
  const [session, loading] = useSession()
  const router = useRouter()

  const SidebarLink = ({ url, text, onClick }: ButtonProps) =>
    url ? (
      <Link href={url} passHref>
        <Button
          as="a"
          isActive={router.asPath.includes(url)}
          borderRadius="none"
          bg="#eaeaea"
          _hover={{ bg: 'blue.200' }}
          _active={{ bg: 'blue.200' }}
          onClick={() => {
            handleToggle && handleToggle()
          }}
        >
          {text}
        </Button>
      </Link>
    ) : (
      <Button
        borderRadius="none"
        bg="#eaeaea"
        _hover={{ bg: 'blue.200' }}
        _active={{ bg: 'blue.200' }}
        onClick={onClick}
      >
        {text}
      </Button>
    )

  return (
    <Flex flexDirection="column" bg="#eaeaea" w={180} flexShrink={0} zIndex="modal" {...rest}>
      <Link href="/" passHref>
        <IconButton aria-label="home" icon={<StarIcon />} />
      </Link>

      <SidebarLink url="/anime/season" text="番表" />
      <SidebarLink url="/following" text="追蹤" />
      <Spacer />
      {loading ? (
        <Progress isIndeterminate />
      ) : (
        <>
          {!session && <SidebarLink text="登入" onClick={() => signIn('google')} />}
          {session && (
            <>
              <SidebarLink url="/setting" text="設定" />
              <SidebarLink text="登出" onClick={() => signOut()} />
              {/* <SidebarLink url="/admin" text="Admin" />
              <SidebarLink url="/home" text="Home" />
              <Button>Profile</Button>
              <Button>Notification</Button>
              <Button>User</Button>
              <Button>Theme</Button>
              <Button>Help</Button> */}
            </>
          )}
        </>
      )}
    </Flex>
  )
}
