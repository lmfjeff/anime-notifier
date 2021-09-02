import { HamburgerIcon } from '@chakra-ui/icons'
import { Box, Button, Container, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import React, { useState } from 'react'
import { createBreakpoint } from 'react-use'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout: React.FC = ({ children }) => {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <>
      <Navbar display={['flex', null, 'none']} handleToggle={onToggle} isOpen={isOpen} />
      <Flex h={[null, null, '100vh']} flexDir="row" bg="#f3f3f3">
        {isOpen ? (
          <Sidebar position={['fixed', null, null]} top="0" bottom="0" handleToggle={onToggle} isOpen={isOpen} />
        ) : null}
        <Sidebar display={['none', null, 'flex']} />

        <Box id="scrollableDiv" overflowY="scroll" flexGrow={1} p={5}>
          {children}
        </Box>
      </Flex>
    </>
  )
}
