import { Button, ButtonProps } from '@chakra-ui/button'
import { Box, HStack } from '@chakra-ui/layout'
import { NextRouter, useRouter } from 'next/router'
import React from 'react'

export const SettingPanelTab = () => {
  const router = useRouter()
  return (
    <HStack justify="center" spacing="0" flexWrap="wrap" my={5}>
      <SettingTab url="/setting" text="帳號" router={router} />
      <SettingTab url="/setting/notification" text="通知" router={router} />
    </HStack>
  )
}

type SettingTabProps = {
  url: string
  text: string
  router: NextRouter
}

const SettingTab = ({ url, text, router }: SettingTabProps) => {
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
