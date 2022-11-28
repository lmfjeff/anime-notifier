import { Box, BoxProps, Flex, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Backdrop } from './Backdrop'
import { LoginModal } from './LoginModal'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

type LayoutProps = {
  children: React.ReactNode
  title?: string
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { isOpen: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure()

  const [isLoginModalOpen, setLoginModalOpen] = useState(false)
  const closeLoginModal = () => setLoginModalOpen(false)
  const openLoginModal = () => setLoginModalOpen(true)

  return (
    <>
      <Flex minH="100vh" flexDir="column">
        {/* mobile/tablet navbar with hamburger */}
        <Navbar display={['flex', null, 'none']} handleToggle={toggleSidebar} title={title} zIndex="sticky" />

        <Flex flexGrow={1} flexDir="row" bg="#f3f3f3">
          {/* desktop sidebar */}
          <Sidebar
            display={['none', null, 'flex']}
            position="sticky"
            top="0"
            h="100vh"
            openLoginModal={openLoginModal}
          />
          <Box flexGrow={1} py={[2, 3, 5]} px={[2, 3, 5]}>
            {children}
          </Box>
        </Flex>
      </Flex>

      {/* mobile hamburger sidebar */}
      {isSidebarOpen && (
        <Backdrop onClick={toggleSidebar} zIndex="overlay">
          <Sidebar
            position={['fixed', null, null]}
            top="0"
            left="0"
            h="full"
            toggleSidebar={toggleSidebar}
            openLoginModal={openLoginModal}
          />
        </Backdrop>
      )}

      <LoginModal handleClose={closeLoginModal} zIndex="overlay" display={isLoginModalOpen ? 'flex' : 'none'} />
    </>
  )
}
