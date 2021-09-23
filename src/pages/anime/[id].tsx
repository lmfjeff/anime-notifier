import { AspectRatio, Box, Container, Flex, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { AnimeImage } from '../../components/AnimeImage'
import { HtmlHead } from '../../components/HtmlHead'
import {
  seasonTcOption,
  sourceTcOption,
  statusTcOption,
  typeTcOption,
  weekdayTcOption,
} from '../../constants/animeOption'
import { getAnimeById } from '../../services/animeService'
import { anime } from '../../types/anime'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const resp = await getAnimeById(params)

  return {
    props: { resp },
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

type Props = {
  resp: { anime: anime }
}

AnimeById.getTitle = '動畫詳情'

export default function AnimeById({ resp }: Props) {
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
    const [year, season] = yearSeason?.split('-') || []
    return (
      <>
        <HtmlHead title={title} description={summary || ''} />
        <Flex wrap="wrap" justifyContent="center" alignItems="flex-start">
          <AspectRatio w="300px" ratio={3 / 4} mb={5}>
            <AnimeImage src={picture || ''} alt="" borderRadius={2} boxShadow="0 0 3px gray" />
          </AspectRatio>
          <Box flexGrow={5} mx={5} width="350px" mb={5}>
            <Text fontSize="2xl">{title}</Text>
            <Text fontSize="sm" color="gray">
              {alternative_titles?.ja}
            </Text>
            <Text my={5}>{summary || '未有介紹'}</Text>
            <Text my={3}>
              季度: {year} {seasonTcOption[season || ''] || ''}
            </Text>
            {dayOfWeek && (
              <Text my={3}>
                逢{weekdayTcOption[dayOfWeek || '']} {time}
              </Text>
            )}
            {/* <Flex wrap="wrap" my={3}>
              {genres?.map((genre: any) => (
                <Text key={genre} mr={5} mb={3} p={1.5} fontSize="smaller" bg="blue.200">
                  {genre}
                </Text>
              ))}
            </Flex> */}
          </Box>
          <Table variant="simple" colorScheme="blackAlpha" width="300px" flexGrow={1} mb={5}>
            <Tbody>
              <Tr>
                <Td>種類</Td>
                <Td isNumeric>{typeTcOption[type]}</Td>
              </Tr>
              <Tr>
                <Td>狀態</Td>
                <Td isNumeric>{statusTcOption[status]}</Td>
              </Tr>
              <Tr>
                <Td>開始</Td>
                <Td isNumeric>{startDate || '未知'}</Td>
              </Tr>
              <Tr>
                <Td>結束</Td>
                <Td isNumeric>{endDate || '未知'}</Td>
              </Tr>
              <Tr>
                <Td>改編</Td>
                <Td isNumeric>{sourceTcOption[source || ''] || '未知'}</Td>
              </Tr>
              <Tr>
                <Td>工作室</Td>
                <Td isNumeric>
                  {studios.map(studio => (
                    <Text key={studio}>{studio}</Text>
                  ))}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Flex>
      </>
    )
  }
  return <div>錯誤動畫ID</div>
}
