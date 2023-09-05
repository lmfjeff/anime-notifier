import { Box, Button, Flex, FlexProps, Input, Progress, Spacer } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link } from './CustomLink'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

type SideBarProps = FlexProps & {
  toggleSidebar?: () => void
  openLoginModal?: () => void
}

type SidebarLinkProps = {
  text: string
  url?: string
  checkActive?: (url: string) => boolean
  onClick?: () => void
  toggleSidebar?: () => void
}

const SidebarLink = ({ text, url, checkActive, onClick, toggleSidebar }: SidebarLinkProps) => {
  return url ? (
    <Link href={url}>
      <Button
        w="full"
        isActive={checkActive && checkActive(url)}
        borderRadius="none"
        bg="#eaeaea"
        fontWeight="normal"
        _hover={{ bg: 'blue.100' }}
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
      w="full"
      borderRadius="none"
      bg="#eaeaea"
      fontWeight="normal"
      _hover={{ bg: 'blue.100' }}
      _active={{ bg: 'blue.200' }}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

export const Sidebar = (props: SideBarProps) => {
  const { toggleSidebar, openLoginModal, ...rest } = props

  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const router = useRouter()
  const checkActive = (url: string) => {
    const reg = new RegExp('^' + url)
    return reg.test(router.asPath)
  }

  const [search, setSearch] = useState('')

  return (
    <Flex flexDirection="column" bg="#eaeaea" w={180} flexShrink={0} {...rest}>
      <Link href="/">
        <Button
          w="full"
          bg="gray.400"
          _hover={{}}
          _focus={{}}
          borderRadius="0"
          fontFamily="yomogi"
          onClick={() => {
            toggleSidebar && toggleSidebar()
          }}
        >
          動畫新番網
        </Button>
      </Link>
      <SidebarLink url="/anime/season" text="番表" checkActive={checkActive} />
      <SidebarLink url="/following" text="追蹤" checkActive={checkActive} />
      <SidebarLink url="/faq" text="FAQ" checkActive={checkActive} />

      <Spacer />
      <Box px={1}>
        <Input
          bg="whiteAlpha.500"
          placeholder="搜尋"
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (!search) return
            if (e.key === 'Enter') {
              router.push({
                pathname: '/anime/search',
                query: { q: search },
              })
            }
          }}
        />
      </Box>
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
              <SidebarLink url="/setting" text="設定" checkActive={checkActive} />
              <SidebarLink text="登出" onClick={() => signOut()} />
            </>
          )}
        </>
      )}
    </Flex>
  )
}
