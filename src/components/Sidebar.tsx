import { Button, Flex, FlexProps, Progress, Spacer, IconButton } from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

type SideBarProps = FlexProps & {
  toggleSidebar?: () => void
  openLoginModal?: () => void
}

type SidebarLinkProps = {
  url?: string
  text: string
  onClick?: () => void
}

export const Sidebar = (props: SideBarProps) => {
  const { toggleSidebar, openLoginModal, ...rest } = props

  const [session, loading] = useSession()

  const router = useRouter()
  const checkActive = (url: string) => {
    const reg = new RegExp('^' + url)
    return reg.test(router.asPath)
  }

  const SidebarLink = ({ url, text, onClick }: SidebarLinkProps) =>
    url ? (
      <Link href={url} passHref>
        <Button
          as="a"
          isActive={checkActive(url)}
          borderRadius="none"
          bg="#eaeaea"
          fontWeight="normal"
          _hover={{ bg: 'blue.200' }}
          _active={{ bg: 'blue.200' }}
          onClick={() => {
            toggleSidebar && toggleSidebar()
          }}
        >
          {text}
        </Button>
      </Link>
    ) : (
      <Button
        borderRadius="none"
        bg="#eaeaea"
        fontWeight="normal"
        _hover={{ bg: 'blue.200' }}
        _active={{ bg: 'blue.200' }}
        onClick={onClick}
      >
        {text}
      </Button>
    )

  const HomeLink = () => (
    <Link href="/" passHref>
      <Button
        as="a"
        bg="gray.400"
        _hover={{}}
        _focus={{}}
        borderRadius="0"
        fontFamily="yomogi"
        onClick={() => {
          toggleSidebar && toggleSidebar()
        }}
      >
        Anime Notifier
      </Button>
    </Link>
  )

  return (
    <Flex flexDirection="column" bg="#eaeaea" w={180} flexShrink={0} {...rest}>
      <HomeLink />
      <SidebarLink url="/anime/season" text="番表" />
      <SidebarLink url="/following" text="追蹤" />
      <SidebarLink url="/faq" text="FAQ" />
      {/* REMOVE AFTER TESTING */}
      {/* <SidebarLink url="/admin" text="ADMIN" /> */}

      <Spacer />
      {loading ? (
        <Progress isIndeterminate />
      ) : (
        <>
          {!session && (
            <SidebarLink
              text="登入"
              onClick={() => {
                toggleSidebar && toggleSidebar()
                openLoginModal && openLoginModal()
              }}
            />
          )}
          {session && (
            <>
              <SidebarLink url="/setting" text="設定" />
              <SidebarLink text="登出" onClick={() => signOut()} />
            </>
          )}
        </>
      )}
    </Flex>
  )
}
