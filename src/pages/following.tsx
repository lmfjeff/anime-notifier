import { Button, Center, Flex, IconButton, Spacer, Spinner, Text, Box, Select } from '@chakra-ui/react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useQuery, useQueryClient } from 'react-query'
import { useFollowingQuery } from '../hooks/useFollowingQuery'
import { CloseIcon } from '@chakra-ui/icons'
import { Link } from '../components/CustomLink'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { HtmlHead } from '../components/HtmlHead'
import { FollowingAnime } from '../types/anime'
import { FollowList, Prisma } from '@prisma/client'
import { WATCH_STATUS_COLOR, WATCH_STATUS_DISPLAY_NAME } from '../constants/followOption'
import { AnimelistSortFilter } from '../components/AnimelistSortFilter'
import { PrefContext } from '../context/pref'
import { seasonOption, seasonTcOption } from '../constants/animeOption'
import { range } from 'ramda'

FollowingPage.getTitle = '追蹤'

export default function FollowingPage() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const queryClient = useQueryClient()
  const [changeStatusLoading, setChangeStatusLoading] = useState(false)

  const pref = useContext(PrefContext)
  const {
    followSort,
    followOrder,
    followStatus,
    handleChangeFollowSort,
    handleChangeFollowOrder,
    handleChangeFollowStatus,
  } = pref

  const { data, fetchNextPage, hasNextPage, isFetching, refetch } = useFollowingQuery(
    !!session,
    followSort,
    followOrder,
    followStatus
  )

  const animes = data?.pages.map(({ animes }) => animes).flat() || []

  // todo optimistic update, no need to unvalidate whole query if followed many
  const upsertAnimelist = async (data: Partial<FollowList>) => {
    await axios.post('/api/following', data)
    await refetch()
  }

  const removeFollowing = async (id: string) => {
    await axios.delete('/api/following', { params: { media_id: id } })
    // await queryClient.invalidateQueries(['animes', 'following'])
    await refetch()
  }

  const handleVote = async (r: string, id: number) => {
    setChangeStatusLoading(true)
    try {
      await upsertAnimelist({
        media_id: id,
        score: parseFloat(r),
      })
    } catch {
      alert('評分失敗 請再試')
    }
    setChangeStatusLoading(false)
  }

  const handleChangeStatus = async (s: string, id: number) => {
    setChangeStatusLoading(true)
    try {
      await upsertAnimelist({
        media_id: id,
        watch_status: s,
      })
    } catch {
      alert('更改失敗 請再試')
    }
    setChangeStatusLoading(false)
  }

  return (
    <>
      <HtmlHead title="追蹤的動畫" />
      {session && (
        <Flex flexDir="column" alignItems="center" w="full">
          <AnimelistSortFilter
            sort={followSort}
            setSort={handleChangeFollowSort}
            sortOrder={followOrder}
            setSortOrder={handleChangeFollowOrder}
            statusFilter={followStatus}
            setStatusFilter={handleChangeFollowStatus}
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
                  <FollowingList
                    animes={animes}
                    removeFollowing={removeFollowing}
                    disabled={isFetching}
                    handleVote={handleVote}
                    handleChangeStatus={handleChangeStatus}
                    changeStatusLoading={changeStatusLoading}
                  />
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
  handleVote: (r: string, id: number) => Promise<void>
  handleChangeStatus: (s: string, id: number) => Promise<void>
  changeStatusLoading: boolean
}

const FollowingList = ({
  animes,
  removeFollowing,
  disabled,
  handleVote,
  handleChangeStatus,
  changeStatusLoading,
}: FollowingListProps) => {
  return (
    <>
      {animes.map(({ media, watch_status, score }) => (
        <Link href={`/anime/${media.id}`} key={media.id}>
          <Flex
            px={3}
            alignItems="center"
            gap={1}
            borderBottom="1px"
            borderColor="gray.400"
            _hover={{ bg: 'gray.300' }}
            justifyContent="space-between"
          >
            <Text noOfLines={1}>{media.title?.zh || media.title?.jp}</Text>
            <Box display="flex" alignItems="center" gap={1}>
              {/* {score && (
                <Text bg="blue.100" minWidth="32px" textAlign="center" py={1}>
                  {score}
                </Text>
              )} */}
              <Select
                w="80px"
                variant={'outline'}
                value={score || undefined}
                placeholder=" "
                onChange={e => handleVote(e.target.value, media.id)}
                disabled={changeStatusLoading}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {range(0, 21)
                  .map(n => n / 2)
                  .map(rat => (
                    <option key={rat} value={rat}>
                      {rat}
                    </option>
                  ))}
              </Select>
              <Text bg="blue.100" minWidth="60px" textAlign="center" p={1}>
                {`${media.year}${
                  media.season ? seasonTcOption[seasonOption?.[media.season - 1]]?.replace('番', '') : ''
                }`}
              </Text>
              <Text bg={WATCH_STATUS_COLOR[watch_status]} minWidth="40px" textAlign="center" p={1}>
                {WATCH_STATUS_DISPLAY_NAME[watch_status]}
              </Text>
              <IconButton
                bg="transparent"
                _focus={{}}
                disabled={disabled}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
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
