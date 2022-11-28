import { Button, IconButton } from '@chakra-ui/button'
import { BoxProps, Flex, FlexProps, Text, Box, Spacer } from '@chakra-ui/layout'
import { motion, Variants } from 'framer-motion'
import { signIn } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { Backdrop } from './Backdrop'
import { FcGoogle } from 'react-icons/fc'
import { Icon, Input, Tabs, TabList, Tab, InputRightElement, InputGroup } from '@chakra-ui/react'
import { CloseIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import { userLoginSchema, userRegisterSchema } from '../utils/validation'

type LoginModalProps = {
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
    },
  },
  exit: {
    opacity: 0,
  },
}

export const LoginModal: React.FC<LoginModalProps> = ({ handleClose, zIndex, ...props }) => {
  const [isReg, setIsReg] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const registerWithPw = async () => {
    try {
      await userRegisterSchema.validate({ username, password, recaptcha_token: recaptchaToken })
      await axios.post('/api/user', {
        username,
        password,
        recaptcha_token: recaptchaToken,
      })
      await handleSignin()
    } catch (e: any) {
      // console.log('error', JSON.stringify(e, null, 2))
      alert(e?.response?.data?.error || e?.message || 'Unknown error occured')
      recaptchaRef?.current?.reset()
    }
  }
  const handleSignin = async () => {
    try {
      await userLoginSchema.validate({ username, password })
      const resp = await signIn('credentials', { username, password, redirect: false })
      if (!resp) return
      const { error, ok, status } = resp
      if (error) {
        alert(error)
        return
      }
      handleClose()
    } catch (e: any) {
      // console.log('error', JSON.stringify(e, null, 2))
      alert(e?.message || 'Something went wrong, sign in failed')
    }
  }
  return (
    <Backdrop
      onMouseDown={e => {
        handleClose()
      }}
      zIndex={zIndex}
      {...props}
    >
      <MotionFlex
        position={'relative'}
        flexDir="column"
        alignItems="center"
        background="#FFFFFF"
        maxH="90%"
        h="382px"
        maxW="350px"
        w="90%"
        p={5}
        borderRadius={5}
        onMouseDown={e => {
          e.stopPropagation()
        }}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <IconButton
          position={'absolute'}
          top="0"
          left="0"
          bg="transparent"
          onClick={handleClose}
          icon={<CloseIcon />}
          title="關閉"
          aria-label="close"
        />
        <Button
          bgColor="white"
          boxShadow="0 0 3px gray"
          onClick={() => signIn('google')}
          leftIcon={<Icon as={FcGoogle} bg="transparant" boxSize="24px" />}
          mt={4}
          mb={4}
        >
          <Text color="gray">使用 Google 帳戶登入</Text>
        </Button>
        <Tabs variant="unstyled" mb={2} onChange={i => setIsReg(i === 1)}>
          <TabList>
            <Tab bg="gray" _selected={{ color: 'white', bg: 'blue.500' }}>
              登入
            </Tab>
            <Tab bg="gray" _selected={{ color: 'white', bg: 'blue.500' }}>
              註冊
            </Tab>
          </TabList>
        </Tabs>
        <Input
          placeholder="用戶名"
          mb={2}
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyUp={e => {
            if (e.key === 'Enter' && !isReg) handleSignin()
          }}
        />
        <InputGroup>
          <Input
            placeholder="密碼"
            type={showPw ? 'text' : 'password'}
            mb={2}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyUp={e => {
              if (e.key === 'Enter' && !isReg) handleSignin()
            }}
          />
          <InputRightElement cursor="pointer" onClick={() => setShowPw(o => !o)}>
            {showPw ? <ViewOffIcon /> : <ViewIcon />}
          </InputRightElement>
        </InputGroup>
        <Box display={isReg ? 'none' : 'flex'} flexDir="column" alignItems="center">
          <Button
            bgColor="white"
            boxShadow="0 0 3px gray"
            onClick={handleSignin}
            disabled={!username || !password}
            _disabled={{ cursor: 'not-allowed' }}
          >
            <Text color="gray">使用密碼登入</Text>
          </Button>
        </Box>
        <Box display={isReg ? 'flex' : 'none'} flexDir="column" alignItems="center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={token => setRecaptchaToken(token || '')}
            onExpired={() => setRecaptchaToken('')}
            ref={recaptchaRef}
          />
          <Button
            bgColor="white"
            boxShadow="0 0 3px gray"
            onClick={registerWithPw}
            mt={2}
            disabled={!recaptchaToken || !username || !password}
            _disabled={{ cursor: 'not-allowed' }}
          >
            <Text color="gray">創建帳號</Text>
          </Button>
        </Box>
      </MotionFlex>
    </Backdrop>
  )
}
