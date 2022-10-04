import { AspectRatio, Box, Icon, IconButton, Image as ChakraImage, Text } from '@chakra-ui/react'
import { AddIcon, EditIcon, StarIcon } from '@chakra-ui/icons'
import { FaHeart } from 'react-icons/fa'
import React from 'react'
import Link from 'next/link'
import { AnimeImage } from './AnimeImage'
import { AnimeDetail } from '../types/anime'
import { weekdayTcOption } from '../constants/animeOption'
import { formatHKMonthDay, parseFromDateTime, parseToDayjs } from '../utils/date'
import { Dayjs } from 'dayjs'

type AnimeCardProps = {
  anime: AnimeDetail
  followed: boolean
  addFollowing: (id: string) => Promise<void>
  removeFollowing: (id: string) => Promise<void>
  signedIn: boolean
  now: Dayjs | undefined
}

export const AnimeCard = ({ anime, followed, addFollowing, removeFollowing, signedIn, now }: AnimeCardProps) => {
  const displayName = anime.title
  // const notAired = anime.status === 'not_yet_aired'
  const startDate = anime.startDate
  const startTime = anime.time
  const startDayjs = parseFromDateTime(`${startDate} ${startTime}`)
  const hrToAir = startDayjs && startDayjs.diff(now, 'hour', true)
  const notAired = hrToAir && hrToAir > 0
  const after72Hr = hrToAir && hrToAir > 72
  const startDateString = startDate && (after72Hr ? `${formatHKMonthDay(parseToDayjs(startDate))}首播` : `即將首播`)

  const handleClick = () => {
    if (followed) {
      removeFollowing(anime.id)
    } else {
      addFollowing(anime.id)
    }
  }
  return (
    <Link href={`/anime/${anime.id}`} passHref>
      <Box as="a" position="relative" w="160px">
        <AspectRatio ratio={1}>
          <AnimeImage
            src={anime.picture || ''}
            alt={displayName}
            borderRadius={2}
            boxShadow="0 0 3px gray"
            opacity={notAired && after72Hr ? 0.5 : 1}
          />
        </AspectRatio>
        <Box
          position="absolute"
          top="0"
          textShadow="0 0 3px black"
          color="white"
          fontWeight="semibold"
          bg="blue.200"
          px={1}
          borderRadius={2}
          textAlign="center"
        >
          <Text fontSize="md">
            {weekdayTcOption[anime.dayOfWeek || '']
              ? weekdayTcOption[anime.dayOfWeek || '']?.replace('星期', '')
              : '未知'}
          </Text>
          <Text fontSize="smaller">{anime.time || '無時間'}</Text>
        </Box>
        {notAired && startDateString && (
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
              {startDateString}
            </Text>
          </Box>
        )}
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
        {signedIn && (
          <IconButton
            position="absolute"
            top="0"
            right="0"
            disabled={followed === null}
            onClick={e => {
              e.preventDefault()
              handleClick()
            }}
            borderRadius="24px"
            variant="ghost"
            color={followed ? 'red' : 'white'}
            _hover={{ color: `${followed ? 'red' : 'pink'}` }}
            _focus={{}}
            icon={<Icon boxSize={6} as={FaHeart} filter={`drop-shadow(0 0 2px ${followed ? 'white' : 'black'})`} />}
            title={followed ? '取消追蹤' : '追蹤'}
            aria-label={followed ? 'unfollow' : 'follow'}
          />
        )}
      </Box>
    </Link>
  )
}
