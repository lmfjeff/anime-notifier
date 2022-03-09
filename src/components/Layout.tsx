import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Backdrop } from './Backdrop'
import { LoginModal } from './LoginModal'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout: React.FC<{ title?: string }> = ({ children, title }) => {
  const { isOpen: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure()

  const [isLoginModalOpen, setLoginModalOpen] = useState(false)
  const closeLoginModal = () => setLoginModalOpen(false)
  const openLoginModal = () => setLoginModalOpen(true)

  return (
    <>
      <Flex minH="100vh" flexDir="column">
        {/* mobile/tablet navbar with hamburger */}
        <Navbar display={['flex', null, 'none']} handleToggle={toggleSidebar} title={title} zIndex="1" />

        <Flex flexGrow={1} flexDir="row" bg="#f3f3f3">
          {/* desktop sidebar */}
          <Sidebar
            display={['none', null, 'flex']}
            position="sticky"
            top="0"
            h="100vh"
            openLoginModal={openLoginModal}
          />
          <Box flexGrow={1} p={5}>
            {children}
          </Box>
        </Flex>
      </Flex>

      {/* mobile hamburger sidebar */}
      {isSidebarOpen && (
        <Backdrop onClick={toggleSidebar} zIndex="1">
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

      {isLoginModalOpen && <LoginModal handleClose={closeLoginModal} zIndex="1" />}
    </>
  )
}
