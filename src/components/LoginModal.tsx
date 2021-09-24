import { Button, IconButton } from '@chakra-ui/button'
import { Box, BoxProps, Flex, FlexProps, Spacer, Text } from '@chakra-ui/layout'
import { motion, Variant, Variants } from 'framer-motion'
import { signIn } from 'next-auth/client'
import React from 'react'
import { Backdrop } from './Backdrop'
import { FcGoogle } from 'react-icons/fc'
import { Icon } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

type Props = {
  handleClose: () => void
} & BoxProps

const MotionFlex = motion<FlexProps>(Flex)

const dropIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      //   type: 'spring',
      //   damping: 25,
      //   stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
  },
}

export const LoginModal: React.FC<Props> = ({ handleClose, zIndex }) => {
  return (
    <Backdrop onClick={handleClose} zIndex={zIndex}>
      <MotionFlex
        background="#FFFFFF"
        h="400px"
        maxW="350px"
        w="90%"
        p={5}
        borderRadius={5}
        onClick={e => e.stopPropagation()}
        alignItems="center"
        flexDir="column"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <IconButton
          onClick={handleClose}
          alignSelf="flex-end"
          aria-label="Close"
          icon={<CloseIcon />}
          bg="transparent"
        />
        <Text fontSize="2xl" mb={5}>
          登入
        </Text>
        <Button
          bgColor="white"
          boxShadow="0 0 3px gray"
          onClick={() => signIn('google')}
          leftIcon={<Icon as={FcGoogle} bg="transparant" boxSize="24px" />}
        >
          <Text color="gray" isTruncated>
            使用 Google 帳戶登入
          </Text>
        </Button>
        <Spacer />
        <Text alignSelf="flex-end" fontSize="xs">
          *日後會新增其他登入方法
        </Text>
      </MotionFlex>
    </Backdrop>
  )
}
