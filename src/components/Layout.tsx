import { Box, Button, Container, Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Sidebar } from './Sidebar'

export const Layout: React.FC = ({ children }) => {
  return (
    <Flex h="100vh" flexDir="row">
      <Sidebar />
      <Box overflowY="scroll" id="scrollableDiv" flexGrow={1}>
        {children}
      </Box>
    </Flex>
  )
}
