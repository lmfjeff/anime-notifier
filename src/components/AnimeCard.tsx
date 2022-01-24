import { AspectRatio, Box, IconButton, Image as ChakraImage, Text } from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import React, { useCallback } from 'react'
import { anime } from '../types/anime'
import Link from 'next/link'
import { AnimeImage } from './AnimeImage'
import { parseWeekday } from '../utils/date'

type animeCardProps = {
  anime: anime
  followed: boolean
  addFollowing: (title: string) => void
  removeFollowing: (title: string) => void
  signedIn: boolean
}

// const fallbackImage = path.resolve('image', 'hellomoto.png')

export const AnimeCard = ({ anime, followed, addFollowing, removeFollowing, signedIn }: animeCardProps) => {
  const displayName = anime.title

  const handleClick = useCallback(() => {
    if (followed) {
      removeFollowing(anime.id)
    } else {
      addFollowing(anime.id)
    }
  }, [followed, removeFollowing, anime.id, addFollowing])
  const weekdayTc = ['日', '一', '二', '三', '四', '五', '六']
  return (
    <Box position="relative" w="160px">
      <Link href={`/anime/${anime.id}`} passHref>
        <Box as="a">
          <AspectRatio ratio={1}>
            <AnimeImage src={anime.picture || ''} alt="" borderRadius={2} boxShadow="0 0 3px gray" />
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
            <Text fontSize="md">{anime.dayOfWeek ? weekdayTc[parseWeekday(anime.dayOfWeek)] : '不定'}</Text>
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
        </Box>
      </Link>
      {signedIn && (
        <IconButton
          position="absolute"
          top="0"
          right="0"
          aria-label="Following"
          icon={<AddIcon />}
          disabled={followed === null}
          onClick={handleClick}
          colorScheme={followed ? 'blue' : 'gray'}
        />
      )}
    </Box>
  )
}
