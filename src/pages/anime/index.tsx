import { Box, Button, Flex } from '@chakra-ui/react'
import { range } from 'ramda'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { useAnimesQuery } from '../../hooks/useAnimesQuery'
import AnimeFilter from '../../components/AnimeFilter'
import AnimeList from '../../components/AnimeList'

// todo remove this duplicate page

export default function AnimeListToday() {
  return <div>Anime Index Page</div>
}
