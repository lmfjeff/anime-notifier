import { Button, Center, Flex, IconButton, Spacer, Spinner, Text } from '@chakra-ui/react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQuery, useQueryClient } from 'react-query'
import { useFollowingQuery } from '../hooks/useFollowingQuery'
import { CloseIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  following: string[]
}

export default function Following() {
  const queryClient = useQueryClient()

  const fetchFollowingId = async () => {
    const resp = await axios.get('/api/following')
    const data = await resp.data
    return data
  }
  const fetchFollowingIdQuery = useQuery('fetchFollowingId', fetchFollowingId, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
  })

  const following = fetchFollowingIdQuery.data?.anime

  const { data, fetchNextPage, hasNextPage, isFetching, refetch } = useFollowingQuery(
    following,
    !!following && !fetchFollowingIdQuery.isFetching
  )

  const rawAnimes = data?.pages.map(({ animes }) => animes).flat() || []

  const sortedAnimes = rawAnimes
    ?.filter(anime => following.includes(anime.id))
    .sort((a, b) => following.indexOf(a.id) - following.indexOf(b.id))

  const removeFollowing = async (id: string) => {
    await axios.delete('/api/following', { params: { anime: id } })
    await queryClient.invalidateQueries('fetchFollowingId')
    await queryClient.invalidateQueries(['animes', 'following'])
  }

  return (
    <Flex flexDir="column" alignItems="center">
      <Text color={fetchFollowingIdQuery.isFetching ? 'red' : ''}>fetching id</Text>
      <Text color={isFetching ? 'red' : ''}>fetching anime</Text>
      <Text fontSize="xl">追蹤的動畫</Text>
      <Button onClick={() => refetch()}>refetch</Button>
      {following && <Text pb={2}>總共 {following.length} 套動畫</Text>}
      {following && data && (
        <InfiniteScroll
          dataLength={sortedAnimes.length} // This is important field to render the next data
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<Loading isLoading={isFetching} />}
          endMessage={<End enabled={sortedAnimes.length > 0} />}
          scrollThreshold={0.95}
          scrollableTarget="scrollableDiv"
        >
          <FollowingList animes={sortedAnimes} removeFollowing={removeFollowing} />
        </InfiniteScroll>
      )}
      {!following || !data ? <Loading isLoading={true} /> : null}
    </Flex>
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
}

const FollowingList = ({ animes, removeFollowing }: followingListProps) => {
  return (
    <Flex justifyContent="center">
      <Flex flexDir="column" w={600}>
        {animes.map(({ id, title }) => (
          <Flex
            key={id}
            px={3}
            alignItems="center"
            borderBottom="1px"
            borderColor="gray.400"
            _hover={{ bg: 'gray.300' }}
          >
            <Link href={`/anime/${id}`} passHref>
              <Text as="a">{title}</Text>
            </Link>
            <Spacer />
            <IconButton
              aria-label="remove following"
              icon={<CloseIcon />}
              onClick={() => removeFollowing(id)}
            ></IconButton>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
