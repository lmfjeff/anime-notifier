import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useRef } from 'react'
import { Sidebar } from './Sidebar'

export const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure()
  const display = useBreakpointValue({ base: 'flex', md: 'none' })
  return (
    <>
      {/* <Sidebar position="absolute" top="50px" zIndex="overlay" onBlur={() => onClose()} /> */}
      <Flex minHeight="50px" position="sticky" top="0" bg="gray.300" display={display} alignItems="center">
        <IconButton
          aria-label="Hamburger Menu"
          icon={<HamburgerIcon />}
          bg="transparent"
          w="50px"
          h="50px"
          _focus={{}}
          onClick={() => onToggle()}
        />
        <Text mx={3}>Anime Notifier</Text>
      </Flex>
    </>
  )
}
