import { GetServerSideProps } from 'next'
import { searchAnimes } from '../../services/prisma/anime.service'
import { Media } from '@prisma/client'
import { Link } from '../../components/CustomLink'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async context => {
  const { q, page } = context.query

  // const session = await getSession(context)
  // if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
  //   return {
  //     notFound: true,
  //   }
  // }

  const p = parseInt(page as string) || 1
  const animes = await searchAnimes(q as string, p)

  return {
    props: {
      animes,
      q,
      page: p,
    },
  }
}

export default function AnimeSearchPage({ animes, q, page }: { animes: Media[]; q: string; page: number }) {
  const router = useRouter()
  const changePage = (page: number) => {
    router.push({
      pathname: '/anime/search',
      query: { q, page },
    })
  }
  const isFirstPage = page === 1
  const isLastPage = animes.length < 20
  return (
    <Flex flexDir={'column'} justify={'space-between'} height="full">
      <Flex flexDir={'column'} gap={2} align={'start'} mb={4}>
        {animes.map(({ id, title }) => (
          <Box key={id} _hover={{ bg: '#eaeaea' }}>
            <Link href={`/anime/${id}`}>
              <Text noOfLines={1}>{title?.zh || title?.native || '?????'}</Text>
            </Link>
          </Box>
        ))}
      </Flex>
      <Flex gap={2}>
        <Button variant={'outline'} onClick={() => changePage(page - 1)} visibility={isFirstPage ? 'hidden' : 'unset'}>
          上一頁
        </Button>
        <Button variant={'outline'} onClick={() => changePage(page + 1)} visibility={isLastPage ? 'hidden' : 'unset'}>
          下一頁
        </Button>
      </Flex>
    </Flex>
  )
}
