import { AspectRatio, Box, IconButton, Image as ChakraImage, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import React, { useCallback } from 'react'
import path from 'path'
import { anime } from '../types/anime'
import Link from 'next/link'

type animeCardProps = {
  anime: anime
  followed: boolean
  addFollowing: (title: string) => void
  removeFollowing: (title: string) => void
}

const fallbackImage = path.resolve('image', 'hellomoto.png')

const AnimeCard = ({ anime, followed, addFollowing, removeFollowing }: animeCardProps) => {
  // todo anime.picture
  const displayName = anime.alternative_titles?.ja || anime.title
  const handleClick = useCallback(() => {
    if (followed) {
      removeFollowing(anime.id)
    } else {
      addFollowing(anime.id)
    }
  }, [followed, removeFollowing, anime.id, addFollowing])
  return (
    <Box border="1px" borderColor="black" position="relative" w="144px">
      <Link href={`/anime/${anime.id}`} passHref>
        <AspectRatio ratio={1}>
          <ChakraImage src={fallbackImage} alt="" />
        </AspectRatio>
      </Link>
      <Box position="absolute" top="0" textShadow="0 0 3px black" color="white" fontSize="lg" fontWeight="semibold">
        <Text>{anime.dayOfWeek || '星期不定'}</Text>
        <Text>{anime.time || '無時間'}</Text>
      </Box>
      <Text
        noOfLines={2}
        position="absolute"
        bottom="0"
        textShadow="0 0 3px black"
        color="white"
        fontSize="lg"
        fontWeight="semibold"
      >
        {displayName}
      </Text>
      <IconButton
        aria-label="following"
        icon={<AddIcon />}
        position="absolute"
        top="0"
        right="0"
        onClick={handleClick}
        colorScheme={followed ? 'blue' : 'gray'}
      />
    </Box>
  )
}

export default AnimeCard
