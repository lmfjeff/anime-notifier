import React from 'react'
import { Flex, FlexProps } from '@chakra-ui/layout'
import { Portal } from '@chakra-ui/portal'

export const Backdrop: React.FC<FlexProps> = ({ children, onClick, zIndex }) => {
  return (
    <Portal>
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
      >
        {children}
      </Flex>
    </Portal>
  )
}
