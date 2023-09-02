import { Button } from '@chakra-ui/button'
import { Flex, VStack } from '@chakra-ui/layout'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { Link } from '../../components/CustomLink'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  if (!session || session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      notFound: true,
    }
  }
  return {
    props: {},
  }
}

export default function Admin() {
  return (
    <VStack>
      <div>Admin Page</div>
      <Link href="/admin/anime/season">
        <Button colorScheme="cyan">Edit Animes</Button>
      </Link>
      <Link href="/admin/anime/create">
        <Button colorScheme="cyan">Create Anime</Button>
      </Link>
    </VStack>
  )
}
