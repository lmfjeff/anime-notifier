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
// import { getAnimeById } from '../../services/dynamodb/animeService'
import { getAnimeById } from '../../services/prisma/anime.service'
// import { AnimeDetail } from '../../types/anime'
import { Media, Prisma } from '@prisma/client'
import { formatTimeDetailed, jp2hk, parseToDayjs, transformAnimeLateNight } from '../../utils/date'
import { TiArrowBack } from 'react-icons/ti'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string | undefined }

  const anime = await getAnimeById(id)
  console.log('🚀 ~ file: [id].tsx:24 ~ constgetStaticProps:GetStaticProps= ~ anime:', JSON.stringify(anime, null, 2))

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
  anime: Media
  genTime: string
}

AnimeDetailPage.getTitle = '動畫詳情'

export default function AnimeDetailPage({ anime, genTime }: AnimeDetailPageProps) {
  const tvAnime: Prisma.MediaGetPayload<{ include: { genres: true } }> = transformAnimeLateNight(jp2hk(anime))
  const {
    year,
    season,
    title,
    pictures,
    startDate,
    endDate,
    summary,
    genres,
    format,
    airingStatus,
    dayOfWeek,
    time,
    source,
    studios,
    updatedAt,
    episodes,
  } = tvAnime
  // const [year, season] = yearSeason?.split('-') || []

  const displayedTitle = title?.zh || title?.native || ''
  const displayedSummary = summary?.zh || summary?.en

  return (
    <>
      <HtmlHead title={displayedTitle} description={displayedSummary || ''} />
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
          <AnimeImage src={pictures?.[0] || ''} alt={displayedTitle} borderRadius={2} boxShadow="0 0 3px gray" />
        </AspectRatio>
        <Box flexGrow={1} w={['250px', '400px', null]}>
          <Text fontSize="2xl">{displayedTitle}</Text>
          <Text fontSize="sm" color="gray">
            {title?.zh ? title?.native : ''}
          </Text>
          <Text my={5}>{displayedSummary || '未有介紹'}</Text>
          <Text my={3}>
            季度: {year} {seasonTcOption[season || ''] || ''}
          </Text>
          <Text my={3}>
            {weekdayTcOption[dayOfWeek?.jp || ''] ? '逢' + weekdayTcOption[dayOfWeek?.jp || ''] : '星期未知'} {time?.jp}
          </Text>
          <Flex wrap="wrap" my={3}>
            {genres?.map(genre => {
              const genreName = genre?.name?.zh || genre?.name?.en
              return (
                <Text key={genre.key} mr={3} mb={3} p={1.5} fontSize="smaller" bg="blue.200">
                  {genreName}
                </Text>
              )
            })}
          </Flex>
        </Box>
        <Table variant="simple" colorScheme="blackAlpha" w={['250px', '300px', null]} flexGrow={1}>
          <Tbody>
            <Tr>
              <Td>種類</Td>
              <Td isNumeric>{typeTcOption[format || '']}</Td>
            </Tr>
            <Tr>
              <Td>狀態</Td>
              <Td isNumeric>{statusTcOption[airingStatus || '']}</Td>
            </Tr>
            <Tr>
              <Td>開始</Td>
              <Td isNumeric>{startDate?.jp || '未知'}</Td>
            </Tr>
            <Tr>
              <Td>結束</Td>
              <Td isNumeric>{endDate?.jp || '未知'}</Td>
            </Tr>
            <Tr>
              <Td>集數</Td>
              <Td isNumeric>{episodes || '未知'}</Td>
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
