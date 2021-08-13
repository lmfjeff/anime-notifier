import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Button } from '@chakra-ui/react'

const Signin = () => {
  const [session, loading] = useSession()

  // if (loading) return <div>loading...</div>

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <Button onClick={() => signIn()}>Sign in</Button>
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

export default Signin
