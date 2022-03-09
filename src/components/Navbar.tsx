import { HamburgerIcon } from '@chakra-ui/icons'
import { Flex, FlexProps, IconButton, Text } from '@chakra-ui/react'
import React from 'react'

type NavbarProps = FlexProps & {
  handleToggle: () => void
  title?: string
}

export const Navbar = ({ handleToggle, title, ...rest }: NavbarProps) => {
  return (
    <>
      <Flex minHeight="50px" position="sticky" top="0" left="0" w="full" bg="gray.300" alignItems="center" {...rest}>
        <IconButton
          bg="transparent"
          w="50px"
          h="50px"
          _focus={{}}
          onClick={() => handleToggle()}
          icon={<HamburgerIcon />}
          aria-label="menu"
        />
        <Text mx={3}>{title || ''}</Text>
      </Flex>
    </>
  )
}
