import { Button, ButtonProps } from '@chakra-ui/button'
import { Box, HStack } from '@chakra-ui/layout'
import { useRouter } from 'next/router'
import React from 'react'

export const SettingPanel: React.FC = ({ children }) => {
  const router = useRouter()
  type tabProps = {
    url: string
    text: string
  }
  const SettingTab = ({ url, text }: tabProps) => {
    return (
      <Button
        _active={{ bg: 'blue.500' }}
        colorScheme="blackAlpha"
        borderRadius="0"
        minW="120px"
        isActive={router.asPath === url}
        onClick={() => router.push(url)}
      >
        {text}
      </Button>
    )
  }
  return (
    <Box>
      <HStack justify="center" spacing="0" flexWrap="wrap" my={5}>
        <SettingTab url="/setting" text="帳號" />
        <SettingTab url="/setting/notification" text="通知" />
      </HStack>
      {children}
    </Box>
  )
}
