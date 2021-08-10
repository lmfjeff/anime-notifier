import { AspectRatio, Box, Image as ChakraImage } from '@chakra-ui/react'
import React from 'react'

type anime = {
  title: string
  yearSeason: string
  picture: string
}

const AnimeCard = ({ anime }: { anime: anime }) => {
  return (
    <Box border="1px" borderColor="black">
      <AspectRatio ratio={1}>
        <ChakraImage src={anime.picture} alt="" />
      </AspectRatio>
      {/* <p>{anime.title}</p>
      <p>{anime.yearSeason}</p> */}
    </Box>
  )
}

export default AnimeCard
