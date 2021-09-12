import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'

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

export default function AnimeAdminPage() {
  return <div>Anime Edit</div>
}
