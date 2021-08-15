import { AspectRatio, Box, IconButton, Image as ChakraImage, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import React from 'react'
import path from 'path'

type anime = {
  title: string
  yearSeason: string
  picture: string
}

const fallbackImage = path.resolve('image', 'iyanakao.png')

const AnimeCard = ({ anime }: { anime: anime }) => {
  // todo anime.picture
  return (
    <Box border="1px" borderColor="black" position="relative">
      <AspectRatio ratio={1}>
        <ChakraImage src={fallbackImage} alt="" />
      </AspectRatio>
      {/* <AddIcon position="absolute" top="0" right="0" color="white" /> */}
      <IconButton
        aria-label="add following"
        icon={<AddIcon />}
        position="absolute"
        top="0"
        right="0"
        onClick={() => fetch(`/api/following?anime=${anime.title}`)}
      />
      <Text
        noOfLines={2}
        position="absolute"
        bottom="0"
        textShadow="0 0 3px black"
        color="white"
        fontSize="lg"
        fontWeight="semibold"
      >
        {anime.title}
      </Text>
    </Box>
  )
}

export default AnimeCard
