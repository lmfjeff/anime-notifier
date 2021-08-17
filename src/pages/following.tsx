import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { getFollowing } from '../services/dynamodb'

type followingProps = {
  anime: string[]
}

export default function Following({ anime }: followingProps) {
  return (
    <div>
      <div>Following:</div>
      <ul>{anime && anime.map(id => <li key={id}>{id}</li>)}</ul>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  let resp
  if (session && session.userId) {
    const { userId } = session
    resp = await getFollowing({ userId })
  }
  return {
    props: { ...resp },
  }
}
