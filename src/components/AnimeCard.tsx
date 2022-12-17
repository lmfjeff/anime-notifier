import { AspectRatio, Box, Button, Icon, IconButton, Image as ChakraImage, Select, Text } from '@chakra-ui/react'
import { AddIcon, EditIcon, StarIcon } from '@chakra-ui/icons'
import { FaHeart, FaStar, FaPlus, FaTimes } from 'react-icons/fa'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimeImage } from './AnimeImage'
import { AnimeDetail } from '../types/anime'
import { weekdayTcOption } from '../constants/animeOption'
import { formatHKMonthDay, parseFromDateTime, parseToDayjs } from '../utils/date'
import { Dayjs } from 'dayjs'
import { Anime, Animelist } from '@prisma/client'
import { range } from 'ramda'
import { WATCH_STATUS_DISPLAY_NAME, WATCH_STATUS_OPTIONS } from '../constants/followOption'

type AnimeCardProps = {
  anime: Anime
  // followed: boolean
  followStatus?: Animelist
  upsertAnimelist: (animelist: Partial<Animelist>) => Promise<void>
  removeFollowing: (id: string) => Promise<void>
  signedIn: boolean
  now: Dayjs | undefined
  sort: string
  followFilter: string | null
}

export const AnimeCard = ({
  anime,
  followStatus,
  upsertAnimelist,
  removeFollowing,
  signedIn,
  now,
  sort,
  followFilter,
}: AnimeCardProps) => {
  const displayName = anime.title
  const weekdayString = weekdayTcOption[anime.dayOfWeek || '']
    ? weekdayTcOption[anime.dayOfWeek || '']?.replace('星期', '')
    : '未知'
  const airTime = anime.time
  const timeString = airTime || '無時間'

  const startDate = anime.startDate
  const startDayjs = startDate && airTime && parseFromDateTime(`${startDate} ${airTime}`)
  const hrToAir = startDayjs && startDayjs.diff(now, 'hour', true)
  const notAired = hrToAir && hrToAir > 0
  // const notAired = anime.status === 'not_yet_aired'
  const within72HrToAir = notAired && hrToAir < 72
  const startDateString = within72HrToAir
    ? `即將首播`
    : notAired
    ? `${formatHKMonthDay(parseToDayjs(startDate))}首播`
    : null

  const endDate = anime.endDate
  const endDayjs = parseFromDateTime(`${endDate} ${airTime}`)
  const hrToEnd = endDayjs && endDayjs.diff(now, 'hour', true)
  const isFinished = hrToEnd && hrToEnd < 0
  const within72HrToEnd = hrToEnd && !isFinished && hrToEnd < 72
  const endString = within72HrToEnd ? '最後一集' : isFinished ? '已完' : null

  const malScore = anime.mal_score || '無'
  const score =
    anime.average_vote_score || anime.average_vote_score === 0 ? Math.round(anime.average_vote_score * 100) / 100 : '無'

  const [showModal, setShowModal] = useState(false)
  const modelRef = useRef<HTMLDivElement>(null)
  const [rating, setRating] = useState('')
  const [watchStatus, setWatchStatus] = useState('')
  const [followLoading, setFollowLoading] = useState(false)
  const [voteLoading, setVoteLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  const followed = !!followStatus

  useEffect(() => {
    setRating(`${followStatus?.score}` || '')
    setWatchStatus(followStatus?.watch_status || '')
  }, [followStatus])

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      if (followed) {
        await removeFollowing(anime.id)
      } else {
        await upsertAnimelist({
          anime_id: anime.id,
          watch_status: 'watching',
        })
      }
    } catch {
      alert('更改失敗 請再試')
    }
    setFollowLoading(false)
  }
  const handleVote = async () => {
    if (!rating) {
      alert('請選擇評分')
      return
    }
    setVoteLoading(true)
    try {
      await upsertAnimelist({
        anime_id: anime.id,
        score: parseInt(rating),
      })
    } catch {
      alert('評分失敗 請再試')
    }
    setVoteLoading(false)
  }
  const handleChangeStatus = async () => {
    if (!watchStatus) {
      alert('請選擇觀看狀態')
      return
    }
    setStatusLoading(true)
    try {
      await upsertAnimelist({
        anime_id: anime.id,
        watch_status: watchStatus,
      })
    } catch {
      alert('更改失敗 請再試')
    }
    setStatusLoading(false)
  }
  const toggleModal = () => {
    setShowModal(!showModal)
  }
  useEffect(() => {
    if (showModal) {
      if (modelRef) {
        modelRef.current?.focus()
      }
    }
  }, [showModal])
  const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowModal(false)
    }
  }
  if (followed && followFilter === 'hideFollowed') return null
  if (!followed && followFilter === 'hideUnfollowed') return null
  return (
    <Link href={`/anime/${anime.id}`} passHref>
      <Box as="a" position="relative">
        <AspectRatio ratio={1}>
          <AnimeImage
            src={anime.picture || ''}
            alt={displayName}
            borderRadius={2}
            boxShadow="0 0 3px gray"
            opacity={(notAired && !within72HrToAir) || isFinished ? 0.5 : 1}
          />
        </AspectRatio>
        <Box display={showModal ? 'none' : 'unset'}>
          <Box
            position="absolute"
            top="0"
            right="0"
            textShadow="0 0 3px black"
            color="white"
            fontWeight="semibold"
            bg="blue.200"
            px={1}
            borderRadius={2}
            textAlign="center"
          >
            {sort === 'mal_score' ? (
              // todo styling
              <Text>{malScore}</Text>
            ) : sort === 'score' ? (
              // todo styling
              <Text>{score}</Text>
            ) : (
              <>
                <Text fontSize="md">{weekdayString}</Text>
                <Text fontSize="smaller">{timeString}</Text>
              </>
            )}
          </Box>
          <Box
            position="absolute"
            top="0"
            left="50%"
            transform={'translate(-50%, 0)'}
            display="flex"
            justifyContent={'center'}
            alignItems="center"
          >
            <Text textShadow="0 0 6px black" color="white" fontSize={'xs'}>
              {startDateString ? startDateString : endString}
            </Text>
          </Box>
          <Text
            noOfLines={2}
            position="absolute"
            bottom="0"
            textShadow="0 0 6px black"
            color="white"
            fontSize="lg"
            fontWeight="semibold"
          >
            {displayName}
          </Text>
        </Box>
        {signedIn && (
          <Box
            position="absolute"
            top="0"
            left="0"
            p={1}
            ref={modelRef}
            tabIndex={-1}
            onBlur={handleBlur}
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}
            zIndex="base"
            width={showModal ? 'full' : 'unset'}
            height={showModal ? 'full' : 'unset'}
            display="flex"
            flexDir="column"
            alignItems="start"
            gap={3}
            bg={showModal ? '#e0e0e080' : 'unset'}
          >
            <Box display="flex" width="full">
              <IconButton
                disabled={followed === null}
                onClick={e => {
                  toggleModal()
                }}
                // borderRadius="24px"
                // variant="ghost"
                bg={followed ? (followStatus?.watch_status === 'dropped' ? 'red.500' : 'green') : 'white'}
                color={followed ? 'white' : 'black'}
                _hover={{}}
                _focus={{}}
                icon={<Icon as={showModal ? FaTimes : FaPlus} />}
                // filter={`drop-shadow(0 0 2px ${followed ? 'white' : 'black'})`}
                title="追番/評分"
                aria-label="follow or rate"
              />
              {showModal && (
                <Button
                  color="white"
                  _hover={{}}
                  bg={followed ? 'red.500' : 'green'}
                  onClick={e => {
                    handleFollow()
                  }}
                  ml="auto"
                  width="50%"
                  isLoading={followLoading}
                >
                  {followed ? '取消追蹤' : '追蹤'}
                </Button>
              )}
            </Box>
            {showModal && (
              <Box width="full" flexGrow={1} display="flex" flexDir="column" gap={3}>
                <Box display={'flex'} gap={1}>
                  <Select
                    bg="white"
                    onChange={e => {
                      setRating(e.target.value)
                    }}
                    value={rating}
                    placeholder=" "
                    width="50%"
                  >
                    {range(0, 11).map(score => (
                      <option key={score} value={score}>
                        {`${score}`}
                      </option>
                    ))}
                  </Select>
                  <Button
                    onClick={e => {
                      handleVote()
                      // toggleModal()
                    }}
                    width="50%"
                    isLoading={voteLoading}
                  >
                    評分
                  </Button>
                </Box>
                <Box display={'flex'} gap={1}>
                  <Select
                    bg="white"
                    onChange={e => {
                      setWatchStatus(e.target.value)
                    }}
                    value={watchStatus}
                    placeholder=" "
                    width="50%"
                  >
                    {WATCH_STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>
                        {WATCH_STATUS_DISPLAY_NAME[status]}
                      </option>
                    ))}
                  </Select>
                  <Button
                    onClick={e => {
                      handleChangeStatus()
                      // toggleModal()
                    }}
                    width="50%"
                    isLoading={statusLoading}
                  >
                    更新
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Link>
  )
}
