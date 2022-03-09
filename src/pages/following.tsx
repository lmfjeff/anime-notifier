import { Button, Center, Flex, IconButton, Spacer, Spinner, Text, Box } from '@chakra-ui/react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQuery, useQueryClient } from 'react-query'
import { useFollowingQuery } from '../hooks/useFollowingQuery'
import { CloseIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { HtmlHead } from '../components/HtmlHead'
import { FollowingAnime } from '../types/anime'

FollowingPage.getTitle = '追蹤'

export default function FollowingPage() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const queryClient = useQueryClient()

  const { data, fetchNextPage, hasNextPage, isFetching } = useFollowingQuery(!!session)

  const animes = data?.pages.map(({ animes }) => animes).flat() || []

  // todo optimistic update, no need to unvalidate whole query if followed many
  const removeFollowing = async (id: string) => {
    await axios.delete('/api/following', { params: { animeId: id } })
    await queryClient.invalidateQueries(['animes', 'following'])
  }

  return (
    <>
      <HtmlHead title="追蹤的動畫" />
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

type FollowingListProps = {
  animes: FollowingAnime[]
  removeFollowing: (id: string) => Promise<void>
  disabled: boolean
}

const FollowingList = ({ animes, removeFollowing, disabled }: FollowingListProps) => {
  return (
    <>
      {animes.map(({ id, title }) => (
        <Link href={`/anime/${id}`} passHref key={id}>
          <Flex
            px={3}
            alignItems="center"
            borderBottom="1px"
            borderColor="gray.400"
            _hover={{ bg: 'gray.300' }}
            justifyContent="space-between"
            as="a"
          >
            <Text>{title}</Text>
            <IconButton
              bg="transparent"
              _focus={{}}
              disabled={disabled}
              onClick={e => {
                e.preventDefault()
                removeFollowing(id)
              }}
              icon={<CloseIcon />}
              aria-label="unfollow"
              title="取消追蹤"
            ></IconButton>
          </Flex>
        </Link>
      ))}
    </>
  )
}
