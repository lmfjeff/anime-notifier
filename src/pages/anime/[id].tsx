import { AspectRatio, Box, Container, Flex, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { AnimeImage } from '../../components/AnimeImage'
import { getAnimeById } from '../../services/animeService'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resp = await getAnimeById(params)

  return {
    props: { resp },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export default function AnimeById({ resp }: { resp: any }) {
  const { anime } = resp
  if (anime) {
    const {
      id,
      yearSeason,
      title,
      picture,
      alternative_titles,
      startDate,
      endDate,
      summary,
      genres,
      type,
      status,
      dayOfWeek,
      time,
      source,
      studios,
    } = anime
    return (
      <>
        <Flex wrap="wrap" justifyContent="center" alignItems="flex-start">
          <Box w="300px" minWidth="300px" mb={5}>
            <AspectRatio ratio={3 / 4}>
              <AnimeImage src={picture} alt="" borderRadius={2} boxShadow="0 0 3px gray" />
            </AspectRatio>
          </Box>
          <Box flexGrow={5} mx={5} width="350px" mb={5}>
            <Text fontSize="2xl">{title}</Text>
            <Text fontSize="sm" color="gray">
              {alternative_titles.ja}
            </Text>
            <Text my={5}>{summary}</Text>
            <Text my={3}>季度: {yearSeason}</Text>
            <Text my={3}>
              逢 {dayOfWeek} {time}
            </Text>
            <Flex wrap="wrap">
              {genres.map((genre: any) => (
                <Text key={genre} mr={5} p={1.5} fontSize="smaller" bg="blue.200">
                  {genre}
                </Text>
              ))}
            </Flex>
          </Box>
          <Table variant="simple" colorScheme="blackAlpha" width="300px" flexGrow={1} mb={5}>
            <Tbody>
              <Tr>
                <Td>種類</Td>
                <Td isNumeric>{type}</Td>
              </Tr>
              <Tr>
                <Td>狀態</Td>
                <Td isNumeric>{status}</Td>
              </Tr>
              <Tr>
                <Td>開始</Td>
                <Td isNumeric>{startDate}</Td>
              </Tr>
              <Tr>
                <Td>結束</Td>
                <Td isNumeric>{endDate || '未知'}</Td>
              </Tr>
              <Tr>
                <Td>改編</Td>
                <Td isNumeric>{source}</Td>
              </Tr>
              <Tr>
                <Td>工作室</Td>
                <Td isNumeric>{studios || 'n/a'}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Flex>
      </>
    )
  }
  return <div>no this anime id</div>
}
