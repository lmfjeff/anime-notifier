import { Input } from '@chakra-ui/input'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import React, { useCallback, useState } from 'react'
import { HtmlHead } from '../../components/HtmlHead'
import { SettingPanelTab } from '../../components/SettingPanelTab'
import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  return {
    props: { session },
  }
}

Account.getTitle = '設定'

export default function Account() {
  const { data: session } = useSession()

  const onDrop = useCallback(async (files: File[]) => {
    try {
      if (files.length === 0) return
      const formdata = new FormData()
      formdata.set('file', files[0])
      await axios.post('/api/import', formdata)
    } catch (e) {
      alert('導入失敗')
    } finally {
      alert('導入成功')
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleExport = async () => {
    const { data } = await axios.get('/api/export')
    // console.log("🚀 ~ file: index.tsx:25 ~ handleExport ~ data:", data)

    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
  }

  if (!session)
    return (
      <Flex h="full" justifyContent="center" alignItems="center">
        <Text alignSelf="center">請登入</Text>
      </Flex>
    )

  return (
    <>
      <HtmlHead title="設定" />
      <SettingPanelTab />
      <Flex flexDir="column" alignItems={'center'} gap={6}>
        <Flex w="300px" flexDir="column" gap={3}>
          <Text>連結的 Google 電郵:</Text>
          <Input defaultValue={session?.user?.email || '無'} bg="white" isDisabled _disabled={{}} />
        </Flex>
        <Flex gap={3} align={'center'}>
          <Button colorScheme="blue" onClick={handleExport}>
            導出追蹤記錄
          </Button>
          <Flex
            {...getRootProps()}
            px={4}
            py={2}
            borderRadius={4}
            color="white"
            fontWeight={700}
            cursor={'pointer'}
            bg={'blue.500'}
            _hover={{ bg: 'blue.600' }}
          >
            <input {...getInputProps()} />
            <p>導入追蹤記錄</p>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
