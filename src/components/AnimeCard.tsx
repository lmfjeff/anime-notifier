import { AspectRatio, Box, Icon, IconButton, Image as ChakraImage, Text } from '@chakra-ui/react'
import { AddIcon, EditIcon, StarIcon } from '@chakra-ui/icons'
import { FaRegStar, FaStar } from 'react-icons/fa'
import React from 'react'
import Link from 'next/link'
import { AnimeImage } from './AnimeImage'
import { AnimeOverview } from '../types/anime'
import { weekdayTcOption } from '../constants/animeOption'

type AnimeCardProps = {
  anime: AnimeOverview
  followed: boolean
  addFollowing: (id: string) => Promise<void>
  removeFollowing: (id: string) => Promise<void>
  signedIn: boolean
}

export const AnimeCard = ({ anime, followed, addFollowing, removeFollowing, signedIn }: AnimeCardProps) => {
  const displayName = anime.title

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
          <AnimeImage src={anime.picture || ''} alt={displayName} borderRadius={2} boxShadow="0 0 3px gray" />
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
            icon={<Icon as={followed ? FaStar : FaRegStar} boxSize={'22px'} />}
            title={followed ? '取消追蹤' : '追蹤'}
            aria-label={followed ? 'unfollow' : 'follow'}
          />
        )}
      </Box>
    </Link>
  )
}
