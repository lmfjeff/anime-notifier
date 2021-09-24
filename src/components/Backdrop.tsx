import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Flex, FlexProps } from '@chakra-ui/layout'
import { Portal } from '@chakra-ui/portal'

const MotionFlex = motion<FlexProps>(Flex)

export const Backdrop: React.FC<FlexProps> = ({ children, onClick, zIndex }) => {
  return (
    <Portal>
      <MotionFlex
        onClick={onClick}
        position="fixed"
        top="0"
        left="0"
        h="100%"
        w="100%"
        background="#00000080"
        justifyContent="center"
        alignItems="center"
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // exit={{ opacity: 0 }}
        zIndex={zIndex}
      >
        {children}
      </MotionFlex>
    </Portal>
  )
}
