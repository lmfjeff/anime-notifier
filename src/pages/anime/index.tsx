import { Box, Button, Flex } from '@chakra-ui/react'
import { range } from 'ramda'
import Link from 'next/link'

export default function AnimeList() {
  const yearList = range(1970, 2023)
  return (
    <div>
      <h1>Anime List</h1>
      <Flex flexDir="row" align="center" flexWrap="wrap">
        {yearList.map(year => (
          <Link key={year} href={`anime/season/${year}`} passHref>
            <Button>{year}</Button>
          </Link>
        ))}
      </Flex>
    </div>
  )
}
