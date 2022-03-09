import { IconButton } from '@chakra-ui/button'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { AspectRatio, Box, Text } from '@chakra-ui/layout'
import Link from 'next/link'
import React from 'react'
import { weekdayTcOption } from '../constants/animeOption'
import { AnimeOverview } from '../types/anime'
import { AnimeImage } from './AnimeImage'

type AdminAnimeCardProps = {
  anime: AnimeOverview
  deleteAnime: (id: string) => Promise<void>
}

export const AdminAnimeCard = ({ anime, deleteAnime }: AdminAnimeCardProps) => {
  const displayName = anime.title

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
        <IconButton
          onClick={e => {
            e.preventDefault()
            deleteAnime(anime.id)
          }}
          position="absolute"
          top="0"
          right="0"
          icon={<CloseIcon />}
          title="刪除"
          aria-label="delete"
        />
        <Link href={`/admin/anime/${anime.id}`} passHref>
          <IconButton position="absolute" bottom="0" right="0" icon={<EditIcon />} title="編輯" aria-label="edit" />
        </Link>
      </Box>
    </Link>
  )
}
