import { AspectRatio, Box, IconButton, Image as ChakraImage, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import React from 'react'
import path from 'path'
import { anime } from '../types/anime'
import Link from 'next/link'

type animeCardProps = {
  anime: anime
  followed: boolean
  addFollowing: (title: string) => void
}

const fallbackImage = path.resolve('image', 'hellomoto.png')

const AnimeCard = ({ anime, followed, addFollowing }: animeCardProps) => {
  // todo anime.picture
  const displayName = anime.alternative_titles?.ja || anime.title
  return (
    <Box border="1px" borderColor="black" position="relative" as="button" w="144px">
      {/* <Link href={`/anime/${anime.id}`} passHref> */}
      <Link href={`/anime/${anime.id}`} passHref>
        <AspectRatio ratio={1}>
          <ChakraImage src={fallbackImage} alt="" />
        </AspectRatio>
      </Link>
      <Text position="absolute" top="0" textShadow="0 0 3px black" color="white" fontSize="lg" fontWeight="semibold">
        <p>{anime.dayOfWeek || '星期不定'}</p>
        <p>{anime.time || '無時間'}</p>
      </Text>
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
        aria-label="add following"
        icon={<AddIcon />}
        position="absolute"
        top="0"
        right="0"
        onClick={() => addFollowing(anime.id)}
        disabled={followed}
      />
    </Box>
  )
}

export default AnimeCard
