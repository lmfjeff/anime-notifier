import { HamburgerIcon } from '@chakra-ui/icons'
import { Box, Button, Container, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import React, { useState } from 'react'
import { createBreakpoint } from 'react-use'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout: React.FC<{ title?: string }> = ({ children, title }) => {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Flex minH="100vh" flexDir="column">
      <Navbar display={['flex', null, 'none']} handleToggle={onToggle} isOpen={isOpen} title={title} />
      <Flex flexGrow={1} flexDir="row" bg="#f3f3f3">
        {isOpen ? (
          <Sidebar position={['fixed', null, null]} top="0" bottom="0" handleToggle={onToggle} isOpen={isOpen} />
        ) : null}
        <Sidebar display={['none', null, 'flex']} position="sticky" top="0" h="100vh" />

        <Box flexGrow={1} p={5}>
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
