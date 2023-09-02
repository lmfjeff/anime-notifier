import { Button, Center, Flex, IconButton, Spacer, Spinner, Text, Box } from '@chakra-ui/react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQuery, useQueryClient } from 'react-query'
import { useFollowingQuery } from '../hooks/useFollowingQuery'
import { CloseIcon } from '@chakra-ui/icons'
import { Link } from '../components/CustomLink'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { HtmlHead } from '../components/HtmlHead'
import { FollowingAnime } from '../types/anime'
import { Prisma } from '@prisma/client'
import { WATCH_STATUS_DISPLAY_NAME } from '../constants/followOption'
import { AnimelistSortFilter } from '../components/AnimelistSortFilter'

FollowingPage.getTitle = '追蹤'

export default function FollowingPage() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const queryClient = useQueryClient()
  const [sort, setSort] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [statusFilter, setStatusFilter] = useState('watching')

  const { data, fetchNextPage, hasNextPage, isFetching } = useFollowingQuery(!!session, sort, sortOrder, statusFilter)

  const animes = data?.pages.map(({ animes }) => animes).flat() || []

  // todo optimistic update, no need to unvalidate whole query if followed many
  const removeFollowing = async (id: string) => {
    await axios.delete('/api/following', { params: { media_id: id } })
    await queryClient.invalidateQueries(['animes', 'following'])
  }

  return (
    <>
      <HtmlHead title="追蹤的動畫" />
      {session && (
        <Flex flexDir="column" alignItems="center" w="full">
          <AnimelistSortFilter
            sort={sort}
            setSort={setSort}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
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
          {(!data || isFetching) && <Loading isLoading={true} />}
        </Flex>
      )}
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
  animes: Prisma.FollowListGetPayload<{ include: { media: true } }>[]
  removeFollowing: (id: string) => Promise<void>
  disabled: boolean
}

const FollowingList = ({ animes, removeFollowing, disabled }: FollowingListProps) => {
  return (
    <>
      {animes.map(({ media, watch_status, score }) => (
        <Link href={`/anime/${media.id}`} passHref key={media.id}>
          <Flex
            px={3}
            alignItems="center"
            gap={1}
            borderBottom="1px"
            borderColor="gray.400"
            _hover={{ bg: 'gray.300' }}
            justifyContent="space-between"
          >
            <Text noOfLines={1}>{media.title?.zh || media.title?.native}</Text>
            <Box display="flex" alignItems="center" gap={1}>
              {score && (
                <Text bg="blue.100" minWidth="32px" textAlign="center" py={1}>
                  {score}
                </Text>
              )}
              <Text bg="blue.100" minWidth="40px" textAlign="center" p={1}>
                {WATCH_STATUS_DISPLAY_NAME[watch_status]}
              </Text>
              <IconButton
                bg="transparent"
                _focus={{}}
                disabled={disabled}
                onClick={e => {
                  e.preventDefault()
                  removeFollowing(media.id.toString())
                }}
                icon={<CloseIcon />}
                aria-label="unfollow"
                title="取消追蹤"
              ></IconButton>
            </Box>
          </Flex>
        </Link>
      ))}
    </>
  )
}
