import { Button, Flex, IconButton, Spacer, Text } from '@chakra-ui/react'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQuery } from 'react-query'
import { useFollowingQuery } from '../hooks/useFollowingQuery'
import { getAnimesByIds } from '../services/animeService'
import { getFollowing } from '../services/followingService'
import { CloseIcon } from '@chakra-ui/icons'
import Link from 'next/link'

type Props = {
  following: string[]
}

export default function Following() {
  // const sortedAnimes = animes?.sort((a, b) => following.indexOf(a.id) - following.indexOf(b.id))

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

  const { data, fetchNextPage, hasNextPage, isFetching } = useFollowingQuery(following, !!following)

  const animes = data?.pages.map(({ animes }) => animes).flat() || []

  const sortedAnimes = animes?.sort((a, b) => following.indexOf(a.id) - following.indexOf(b.id))

  return (
    <div>
      <div>Following:</div>
      <div>{hasNextPage ? 'have next' : 'not have next'}</div>
      <div>{isFetching ? 'fetching' : 'not fetching'}</div>
      <Button onClick={() => fetchNextPage()}>Fetch More</Button>

      <InfiniteScroll
        dataLength={sortedAnimes.length} // This is important field to render the next data
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<Loading isLoading={isFetching} />}
        endMessage={<End />}
        scrollThreshold={0.95}
        scrollableTarget="scrollableDiv"
      >
        {sortedAnimes && <FollowingList animes={sortedAnimes} />}
      </InfiniteScroll>
    </div>
  )
}

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return isLoading ? <h4>Loading...</h4> : null
}

const End = () => {
  return <h4>Yay! You have seen it all</h4>
}

const FollowingList = ({ animes }: { animes: any[] }) => {
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
            <IconButton aria-label="remove following" icon={<CloseIcon />}></IconButton>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
