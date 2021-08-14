import React from 'react'
import { getSession, signIn, signOut, useSession } from 'next-auth/client'
import { Button } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'

export default function Signin() {
  const [session, loading] = useSession()

  // if (loading) return <div>loading...</div>

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <Button onClick={() => signIn('google')}>Sign in with Google</Button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user!!.email} <br />
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context)
  return {
    props: { session },
  }
}
