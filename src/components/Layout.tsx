import { Box, Button, Container, Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import RSidebar from 'react-sidebar'
import { Sidebar } from './Sidebar'

export const Layout: React.FC = ({ children }) => {
  return (
    <Flex h="100vh" flexDir="row">
      {/* <RSidebar docked={true} sidebar={<Sidebar />}>
        {children}
      </RSidebar> */}
      <Sidebar />
      <Box overflowY="scroll" id="scrollableDiv" flexGrow={1}>
        {children}
      </Box>
    </Flex>
  )
}
