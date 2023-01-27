import {
  AspectRatio,
  Box,
  BoxProps,
  Button,
  Grid,
  Icon,
  IconButton,
  Image as ChakraImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { FaTimes, FaBars } from 'react-icons/fa'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimeImage } from './AnimeImage'
import { weekdayTcOption } from '../constants/animeOption'
import { formatHKMonthDay, parseFromDateTime, parseToDayjs } from '../utils/date'
import { Dayjs } from 'dayjs'
import { Anime, Animelist } from '@prisma/client'
import { range } from 'ramda'
import { WATCH_STATUS_COLOR, WATCH_STATUS_DISPLAY_NAME, WATCH_STATUS_OPTIONS } from '../constants/followOption'
import { BeatLoader } from 'react-spinners'

type AnimeCardProps = {
  anime: Anime
  followStatus?: Animelist
  upsertAnimelist: (animelist: Partial<Animelist>) => Promise<void>
  removeFollowing: (id: string) => Promise<void>
  now: Dayjs | undefined
  sort: string
  followFilter: string | null
  showMenu: boolean
  thisSeason: boolean
}

export const AnimeCard = ({
  anime,
  followStatus,
  upsertAnimelist,
  removeFollowing,
  now,
  sort,
  followFilter,
  showMenu,
  thisSeason,
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
  const startDateString = within72HrToAir ? `即將首播` : notAired ? `仲有${Math.floor(hrToAir / 24)}日` : null

  const endDate = anime.endDate
  const endDayjs = parseFromDateTime(`${endDate} ${airTime}`)
  const hrToEnd = endDayjs && endDayjs.diff(now, 'hour', true)
  const isFinished = hrToEnd && hrToEnd < 0
  const within72HrToEnd = hrToEnd && !isFinished && hrToEnd < 72
  const almostEndString = within72HrToEnd ? '最後一集' : null
  const endString = isFinished && thisSeason ? '完' : null

  const malScore = anime.mal_score || '無'
  const score =
    anime.average_vote_score || anime.average_vote_score === 0 ? Math.round(anime.average_vote_score * 100) / 100 : '無'

  const [showModal, setShowModal] = useState(false)
  const [rating, setRating] = useState('')
  const [watchStatus, setWatchStatus] = useState('')
  const [followLoading, setFollowLoading] = useState(false)
  const [voteLoading, setVoteLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  const { isOpen: isVoteModalOpen, onToggle: onToggleVoteModal, onClose: onCloseVoteModal } = useDisclosure()
  const { isOpen: isStatusModalOpen, onToggle: onToggleStatusModal, onClose: onCloseStatusModal } = useDisclosure()

  const followed = !!followStatus

  useEffect(() => {
    setRating(followStatus?.score?.toString() || '')
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

  const handleVote = async (r: number) => {
    if (r.toString() === rating) return
    onCloseVoteModal()
    setVoteLoading(true)
    try {
      await upsertAnimelist({
        anime_id: anime.id,
        score: r,
      })
    } catch {
      alert('評分失敗 請再試')
    }
    setVoteLoading(false)
  }

  const handleChangeStatus = async (s: string) => {
    if (s === watchStatus) return
    onCloseStatusModal()
    setStatusLoading(true)
    try {
      await upsertAnimelist({
        anime_id: anime.id,
        watch_status: s,
      })
    } catch {
      alert('更改失敗 請再試')
    }
    setStatusLoading(false)
  }
  const toggleModal = () => {
    setShowModal(!showModal)
  }
  const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowModal(false)
    }
  }

  if (followed && followFilter === 'hideFollowed') return null
  if (!followed && followFilter === 'hideUnfollowed') return null

  return (
    <Box position="relative">
      <Link href={`/anime/${anime.id}`} passHref>
        <AspectRatio ratio={1}>
          <AnimeImage
            src={anime.picture || ''}
            alt={displayName}
            borderRadius={2}
            boxShadow="0 0 3px gray"
            opacity={isFinished && thisSeason ? 0.5 : 1}
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
            borderRadius={2}
            display="flex"
            flexDir={'column'}
            alignItems="center"
            justifyContent={'center'}
            minW="35px"
            minH="35px"
          >
            {sort === 'mal_score' ? (
              <Text>{malScore}</Text>
            ) : sort === 'score' ? (
              <Text>{score}</Text>
            ) : (
              <>
                <Text fontSize="md" px={1}>
                  {weekdayString}
                </Text>
                <Text fontSize="smaller" px={1}>
                  {timeString}
                </Text>
              </>
            )}
          </Box>
          <NoticeWord startDateString={startDateString} almostEndString={almostEndString} endString={endString} />
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
      </Link>

      {showMenu && (
        <Box
          position="absolute"
          top="0"
          left="0"
          p={1}
          // tabIndex={-1}
          onBlur={handleBlur}
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
          }}
          // zIndex="base"
          width={showModal ? 'full' : 'unset'}
          height={showModal ? 'full' : 'unset'}
          display="flex"
          flexDir="column"
          alignItems="start"
          gap={3}
          bg={showModal ? '#e0e0e080' : 'unset'}
        >
          <Box display="flex" width="full" justifyContent={'space-between'}>
            <Button
              onClick={toggleModal}
              borderRadius="40px"
              bg={followed ? WATCH_STATUS_COLOR[followStatus?.watch_status] : 'white'}
              color={followed ? 'white' : 'black'}
              _hover={{}}
              _focus={{}}
              title="追番/評分"
              aria-label="follow or rate"
              px={0}
              // filter={`drop-shadow(0 0 2px ${followed ? 'white' : 'black'})`}
            >
              {showModal ? <Icon as={FaTimes} /> : rating ? <Text>{rating}</Text> : <Icon as={FaBars} />}
            </Button>
            {showModal && (
              <Button
                bg={followed ? 'red.500' : 'green.500'}
                color="black"
                w="40px"
                borderRadius="20px"
                _hover={{}}
                _focus={{}}
                onClick={handleFollow}
              >
                {followLoading ? (
                  <BeatLoader size={6} color="white" />
                ) : (
                  <>
                    <Text color="white">追</Text>
                    {followed ? (
                      <Box position={'absolute'} w="full" borderBottom="2px solid white" transform={'rotate(-45deg)'} />
                    ) : null}
                  </>
                )}
              </Button>
            )}
          </Box>
          {showModal && (
            <>
              <Popover
                placement="left"
                preventOverflow={false}
                isOpen={isVoteModalOpen}
                onClose={onCloseVoteModal}
                isLazy
              >
                <PopoverTrigger>
                  <Button w="40px" borderRadius="20px" onClick={onToggleVoteModal}>
                    {voteLoading ? <BeatLoader size={6} /> : <Text fontSize="sm">{rating || '評分'}</Text>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent w="fit-content">
                  <Grid templateColumns="repeat(2, 1fr)" gap="1px" bg={'gray.200'}>
                    {range(0, 21)
                      .map(n => n / 2)
                      .map(rat => (
                        <Button
                          key={rat}
                          borderRadius={0}
                          bg="white"
                          _hover={{ bg: 'blue.100' }}
                          _active={{ bg: 'blue.200' }}
                          onClick={() => {
                            handleVote(rat)
                          }}
                          isActive={rat.toString() === rating}
                        >
                          {rat}
                        </Button>
                      ))}
                  </Grid>
                </PopoverContent>
              </Popover>
              <Popover
                placement="left"
                preventOverflow={false}
                isOpen={isStatusModalOpen}
                onClose={onCloseStatusModal}
                isLazy
              >
                <PopoverTrigger>
                  <Button w="40px" borderRadius="20px" onClick={onToggleStatusModal}>
                    {statusLoading ? (
                      <BeatLoader size={6} />
                    ) : (
                      <Text fontSize="sm">{WATCH_STATUS_DISPLAY_NAME[watchStatus] || '狀態'}</Text>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent w="fit-content" gap="1px" bg={'gray.200'}>
                  {WATCH_STATUS_OPTIONS.map(status => (
                    <Button
                      key={status}
                      borderRadius={0}
                      bg="white"
                      _hover={{ bg: 'blue.100' }}
                      _active={{ bg: 'blue.200' }}
                      onClick={() => {
                        handleChangeStatus(status)
                      }}
                      isActive={status === watchStatus}
                    >
                      {WATCH_STATUS_DISPLAY_NAME[status]}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}

const NoticeWord = ({
  startDateString,
  almostEndString,
  endString,
}: {
  startDateString?: string | null
  almostEndString?: string | null
  endString?: string | null
}) => {
  if (!startDateString && !almostEndString && !endString) return null
  const endProps: BoxProps = endString
    ? {
        bg: 'red.500',
        w: '35px',
        h: '35px',
        borderRadius: '35px',
      }
    : {
        px: 1,
        bg: 'rgb(0, 0, 0, 0.4)',
      }
  return (
    <Box
      position="absolute"
      top={1}
      left="50%"
      transform={'translate(-50%, 0)'}
      display="flex"
      justifyContent={'center'}
      alignItems="center"
      color="white"
      {...endProps}
    >
      <Text fontSize={endString ? 'xl' : 'sm'}>{startDateString || almostEndString || endString}</Text>
    </Box>
  )
}
