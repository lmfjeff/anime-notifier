import { AspectRatio, Box, Container, Flex, Icon, IconButton, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { AnimeImage } from '../../components/AnimeImage'
import { HtmlHead } from '../../components/HtmlHead'
import {
  genreTcOption,
  seasonTcOption,
  sourceTcOption,
  statusTcOption,
  typeTcOption,
  weekdayTcOption,
} from '../../constants/animeOption'
import { getAnimeById } from '../../services/animeService'
import { AnimeDetail } from '../../types/anime'
import { formatTimeDetailed, jp2hk, parseToDayjs, transformAnimeLateNight } from '../../utils/date'
import { TiArrowBack } from 'react-icons/ti'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string }

  const { anime } = await getAnimeById({ id })

  if (!anime)
    return {
      notFound: true,
    }

  return {
    props: { anime },
    revalidate: 3600,
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

type AnimeDetailPageProps = {
  anime: AnimeDetail
  genTime: string
}

AnimeDetailPage.getTitle = '動畫詳情'

export default function AnimeDetailPage({ anime, genTime }: AnimeDetailPageProps) {
  const tvAnime: AnimeDetail = transformAnimeLateNight(jp2hk(anime))
  const {
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
    updatedAt,
    numEpisodes,
  } = tvAnime
  const [year, season] = yearSeason?.split('-') || []

  return (
    <>
      <HtmlHead title={title} description={summary || ''} />
      <Flex
        borderRadius={20}
        aria-label="back"
        position={'fixed'}
        display={[null, 'none']}
        onClick={() => {
          window.history.back()
        }}
        _active={{ boxShadow: '0px 0px 2px gray' }}
      >
        <Icon as={TiArrowBack} boxSize={10} color={'green.400'} />
      </Flex>

      <Flex wrap="wrap" justifyContent="center" alignItems="flex-start" gap={5}>
        <AspectRatio w={['250px', '300px', null]} ratio={3 / 4}>
          <AnimeImage src={picture || ''} alt={title} borderRadius={2} boxShadow="0 0 3px gray" />
        </AspectRatio>
        <Box flexGrow={1} w={['250px', '400px', null]}>
          <Text fontSize="2xl">{title}</Text>
          <Text fontSize="sm" color="gray">
            {alternative_titles?.ja || ''}
          </Text>
          <Text my={5}>{summary || '未有介紹'}</Text>
          <Text my={3}>
            季度: {year} {seasonTcOption[season || ''] || ''}
          </Text>
          <Text my={3}>
            {weekdayTcOption[dayOfWeek || ''] ? '逢' + weekdayTcOption[dayOfWeek || ''] : '星期未知'} {time}
          </Text>
          <Flex wrap="wrap" my={3}>
            {genres?.map(genre => (
              <Text key={genre} mr={3} mb={3} p={1.5} fontSize="smaller" bg="blue.200">
                {genreTcOption[genre] || genre}
              </Text>
            ))}
          </Flex>
        </Box>
        <Table variant="simple" colorScheme="blackAlpha" w={['250px', '300px', null]} flexGrow={1}>
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
              <Td>集數</Td>
              <Td isNumeric>{numEpisodes || '未知'}</Td>
            </Tr>
            <Tr>
              <Td>改編</Td>
              <Td isNumeric>{sourceTcOption[source || ''] || '未知'}</Td>
            </Tr>
            <Tr>
              <Td>工作室</Td>
              <Td isNumeric>
                {studios?.map(studio => (
                  <Text key={studio}>{studio}</Text>
                ))}
                {studios?.length === 0 && <Text>未知</Text>}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
      <Flex justifyContent="flex-end" mt={5}>
        <Text fontSize="xs" color="gray">
          Last updated: {formatTimeDetailed(parseToDayjs(updatedAt))}
        </Text>
      </Flex>
    </>
  )
}
