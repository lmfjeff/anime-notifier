import React from 'react'
import { Flex, FlexProps } from '@chakra-ui/layout'

export const Backdrop: React.FC<FlexProps> = ({ children, onClick, zIndex, ...props }) => {
  return (
    <Flex
      onClick={onClick}
      position="fixed"
      top="0"
      left="0"
      h="100%"
      w="100%"
      background="#00000080"
      justifyContent="center"
      alignItems="center"
      zIndex={zIndex}
      {...props}
    >
      {children}
    </Flex>
  )
}
