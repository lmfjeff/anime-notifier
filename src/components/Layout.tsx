import { HamburgerIcon } from '@chakra-ui/icons'
import { Box, Button, Container, Flex, IconButton, Text, useBreakpointValue } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'
import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout: React.FC = ({ children }) => {
  const display = useBreakpointValue({ base: 'none', md: 'flex' })
  return (
    <Flex h="100vh" flexDir="column" bg="#f3f3f3">
      <Navbar />
      <Flex h="100%">
        <Sidebar display={display} />
        <Box overflowY="scroll" id="scrollableDiv" flexGrow={1} p={5}>
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
