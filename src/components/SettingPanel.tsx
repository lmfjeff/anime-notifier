import { Button, ButtonProps } from '@chakra-ui/button'
import { Box, HStack } from '@chakra-ui/layout'
import { useRouter } from 'next/router'
import React from 'react'

export const SettingPanel: React.FC = ({ children }) => {
  const router = useRouter()
  const tabList = ['Account', 'Notification']
  return (
    <Box>
      <HStack justify="center" spacing="0" flexWrap="wrap" my={5}>
        {tabList.map((tab, index) => (
          <Button
            key={tab}
            isActive={router.asPath === (index === 0 ? '/setting' : `/setting/${tab.toLowerCase()}`)}
            _active={{ bg: 'blue.500' }}
            colorScheme="blackAlpha"
            borderRadius="0"
            onClick={() => router.push(index === 0 ? '/setting' : `/setting/${tab.toLowerCase()}`)}
            minW="120px"
          >
            {tab}
          </Button>
        ))}
      </HStack>
      {children}
    </Box>
  )
}
