import { HamburgerIcon } from '@chakra-ui/icons'
import { Flex, FlexProps, IconButton, Text } from '@chakra-ui/react'
import React from 'react'

type NavbarProps = FlexProps & {
  handleToggle: () => void
  title?: string
}

export const Navbar = (props: NavbarProps) => {
  const { handleToggle, title, ...rest } = props

  return (
    <>
      <Flex minHeight="50px" position="sticky" top="0" left="0" w="full" bg="gray.300" alignItems="center" {...rest}>
        <IconButton
          aria-label="Menu"
          icon={<HamburgerIcon />}
          bg="transparent"
          w="50px"
          h="50px"
          _focus={{}}
          onClick={() => handleToggle()}
        />
        <Text mx={3}>{title || ''}</Text>
      </Flex>
    </>
  )
}
