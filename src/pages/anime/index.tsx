import { Box, Button, Flex } from '@chakra-ui/react'
import { range } from 'ramda'
import Link from 'next/link'

export default function AnimeList() {
  const yearList = range(2019, 2023)
  const seasonList = ['SPRING', 'SUMMER', 'FALL', 'WINTER', 'UNDEFINED']
  return (
    <div>
      <h1>Anime List</h1>
      <Flex flexDir="row" align="center" flexWrap="wrap">
        {yearList.map(
          year =>
            seasonList.map(season => (
              <Link key={year.toString() + season} href={`anime/${year}/${season}`} passHref>
                <Button>
                  {year}-{season}
                </Button>
              </Link>
            ))
          // (
          //   <Link key={year} href={`anime/season/${year}`} passHref>
          //     <Button>{year}</Button>
          //   </Link>
          // )
        )}
      </Flex>
    </div>
  )
}
