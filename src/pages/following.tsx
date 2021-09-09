import { Button, Center, Flex, IconButton, Spacer, Spinner, Text, Box } from '@chakra-ui/react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQuery, useQueryClient } from 'react-query'
import { useFollowingQuery } from '../hooks/useFollowingQuery'
import { CloseIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

export default function Following() {
  const [session, loading] = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data, fetchNextPage, hasNextPage, isFetching } = useFollowingQuery(!!session)

  const animes = data?.pages.map(({ animes }) => animes).flat() || []

  // todo use react-query useMutation + optimistic update
  const removeFollowing = async (id: string) => {
    await axios.delete('/api/following', { params: { anime: id } })
    await queryClient.invalidateQueries(['animes', 'following'])
  }

  // useEffect(() => {
  //   router.events.on('routeChangeComplete', () => {
  //     window.scrollTo(0, 0)
  //   })
  // }, [router])

  return (
    <>
      <Flex flexDir="column" alignItems="center" w="full">
        {data && (
          <>
            <Text pb={5}>總共 {data?.pages[0].total} 套動畫</Text>
            <Box maxW={['full', null, '600px']} w={['full', null, '100%']}>
              <InfiniteScroll
                dataLength={animes.length} // This is important field to render the next data
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={<Loading isLoading={isFetching} />}
                endMessage={<End enabled={animes.length > 0} />}
                scrollThreshold={0.95}
              >
                <FollowingList animes={animes} removeFollowing={removeFollowing} disabled={isFetching} />
              </InfiniteScroll>
            </Box>
          </>
        )}
        {session && (!data || isFetching) ? <Loading isLoading={true} /> : null}
      </Flex>
      {!loading && !session && (
        <Flex h="full" justifyContent="center" alignItems="center">
          <Text alignSelf="center">請登入以追蹤動畫</Text>
        </Flex>
      )}
    </>
  )
}

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return isLoading ? <Spinner position="fixed" bottom="15px" right="25px" /> : null
}

const End = ({ enabled }: { enabled: boolean }) => {
  return enabled ? (
    <Flex justifyContent="center">
      <Text py={5}>列表尾</Text>
    </Flex>
  ) : null
}

type followingListProps = {
  animes: any[]
  removeFollowing: (id: string) => Promise<void>
  disabled: boolean
}

const FollowingList = ({ animes, removeFollowing, disabled }: followingListProps) => {
  return (
    <>
      {animes.map(({ id, title }) => (
        <Flex
          key={id}
          px={3}
          alignItems="center"
          borderBottom="1px"
          borderColor="gray.400"
          _hover={{ bg: 'gray.300' }}
          justifyContent="space-between"
        >
          <Link href={`/anime/${id}`} passHref>
            <Text as="a">{title}</Text>
          </Link>
          <IconButton
            aria-label="remove following"
            title="取消追蹤"
            bg="transparent"
            _focus={{}}
            icon={<CloseIcon />}
            disabled={disabled}
            onClick={() => removeFollowing(id)}
          ></IconButton>
        </Flex>
      ))}
    </>
  )
}
