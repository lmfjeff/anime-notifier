import { Box, Flex, Icon, Portal } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ArrowUpIcon } from '@chakra-ui/icons'
import { useInView } from 'react-intersection-observer'
// import { useIntersectionObserver } from '@researchgate/react-intersection-observer'

export const BackToTop = () => {
  const [isTop, setIsTop] = useState(false)
  //   const [ref] = useIntersectionObserver(entry => {
  //     setIsTop(entry.isIntersecting)
  //   })
  const { ref, inView, entry } = useInView()
  return (
    <>
      <Box ref={ref} position="absolute" />
      <Flex
        w="40px"
        h="40px"
        align={'center'}
        justify="center"
        borderRadius={20}
        position={'fixed'}
        zIndex="docked"
        right={3}
        bottom={5}
        bg="white"
        opacity={inView ? 0 : 0.7}
        _hover={{ opacity: inView ? 0 : 1 }}
        cursor="pointer"
        onClick={() => {
          window.scrollTo(0, 0)
        }}
        transition="opacity 0.25s linear"
      >
        <Icon as={ArrowUpIcon} boxSize={8} color={'blue.500'} />
      </Flex>
    </>
  )
}
