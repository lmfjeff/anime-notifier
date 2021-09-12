import { Flex } from '@chakra-ui/layout'
import Image from 'next/image'
import React from 'react'
import notFound from '../../public/image/notFound.png'

export default function Custom404Page() {
  return (
    <Flex h="full" alignItems="center" justifyContent="center">
      <Image src={notFound} alt="404icon" width={300} height={300} />
    </Flex>
  )
}
