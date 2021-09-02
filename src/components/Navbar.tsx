import { HamburgerIcon } from '@chakra-ui/icons'
import { Box, Flex, FlexProps, IconButton, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { Sidebar } from './Sidebar'

type Props = FlexProps & {
  handleToggle: () => void
  isOpen: boolean
}

export const Navbar = (props: Props) => {
  const { handleToggle, isOpen, ...rest } = props
  const Backdrop = () => {
    return (
      <Box
        zIndex="overlay"
        position="fixed"
        top="0"
        bottom="0"
        left="0"
        right="0"
        bg="rgba(0,0,0,0.5)"
        onClick={() => handleToggle()}
      ></Box>
    )
  }

  return (
    <>
      {isOpen ? (
        <>
          <Backdrop />
        </>
      ) : null}
      <Flex minHeight="50px" position="sticky" zIndex="sticky" top="0" bg="gray.300" alignItems="center" {...rest}>
        <IconButton
          aria-label="Hamburger Menu"
          icon={<HamburgerIcon />}
          bg="transparent"
          w="50px"
          h="50px"
          _focus={{}}
          onClick={() => handleToggle()}
        />
        <Text mx={3}>Anime Notifier</Text>
      </Flex>
    </>
  )
}
