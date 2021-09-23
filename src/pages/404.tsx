import { Flex } from '@chakra-ui/layout'
import Image from 'next/image'
import React from 'react'
import notFound from '../../public/image/notFound.png'
import { HtmlHead } from '../components/HtmlHead'

export default function Custom404Page() {
  return (
    <>
      <HtmlHead title="404" />
      <Flex h="full" alignItems="center" justifyContent="center">
        <Image src={notFound} alt="404icon" width={300} height={300} />
      </Flex>
    </>
  )
}
