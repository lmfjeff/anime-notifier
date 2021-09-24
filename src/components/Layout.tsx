import { HamburgerIcon } from '@chakra-ui/icons'
import { Box, Container, Flex, IconButton, Text, useDisclosure, Portal, Button } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/client'
import React, { useState } from 'react'
import { createBreakpoint } from 'react-use'
import { Backdrop } from './Backdrop'
import { LoginModal } from './LoginModal'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout: React.FC<{ title?: string }> = ({ children, title }) => {
  const { isOpen, onToggle } = useDisclosure()

  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = () => setModalOpen(false)
  const openModal = () => setModalOpen(true)

  return (
    <>
      <Flex minH="100vh" flexDir="column">
        <Navbar display={['flex', null, 'none']} handleToggle={onToggle} title={title} zIndex="1" />

        <Flex flexGrow={1} flexDir="row" bg="#f3f3f3">
          <Sidebar display={['none', null, 'flex']} position="sticky" top="0" h="100vh" openModal={openModal} />
          <Box flexGrow={1} p={5}>
            {children}
          </Box>
        </Flex>
      </Flex>

      {isOpen && (
        <Backdrop onClick={onToggle} zIndex="1">
          <Sidebar
            position={['fixed', null, null]}
            top="0"
            left="0"
            h="full"
            handleToggle={onToggle}
            isOpen={isOpen}
            openModal={openModal}
          />
        </Backdrop>
      )}

      {/* <AnimatePresence initial={false} exitBeforeEnter={true}> */}
      {modalOpen && <LoginModal handleClose={closeModal} zIndex="1" />}
      {/* </AnimatePresence> */}
    </>
  )
}
