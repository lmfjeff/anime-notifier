import { IconButton } from '@chakra-ui/button'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { AspectRatio, Box, Link, Text } from '@chakra-ui/layout'
import React from 'react'
import { anime } from '../types/anime'
import { parseWeekday } from '../utils/date'
import { AnimeImage } from './AnimeImage'

type Props = {
  anime: anime
  deleteAnime: (id: string) => Promise<void>
}

export const AdminAnimeCard = ({ anime, deleteAnime }: Props) => {
  const displayName = anime.title
  // todo change localhost to 'media.lmfjeff.com'
  const picture = anime.picture?.includes('localhost') ? anime.picture : ''
  const weekdayTc = ['日', '一', '二', '三', '四', '五', '六']
  return (
    <Box position="relative" w="160px" cursor="pointer">
      <Link href={`/anime/${anime.id}`} passHref>
        <Box as="a">
          <AspectRatio ratio={1}>
            <AnimeImage src={picture} alt="" borderRadius={2} boxShadow="0 0 3px gray" />
          </AspectRatio>
        </Box>
      </Link>
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
      <IconButton
        onClick={() => deleteAnime(anime.id)}
        position="absolute"
        top="0"
        right="0"
        aria-label="Delete"
        icon={<CloseIcon />}
        title="刪除"
      />
      <Link href={`/admin/anime/${anime.id}`} passHref>
        <IconButton title="編輯" position="absolute" bottom="0" right="0" aria-label="Edit" icon={<EditIcon />} />
      </Link>
    </Box>
  )
}
