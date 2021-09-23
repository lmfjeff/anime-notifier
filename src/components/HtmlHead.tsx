import Head from 'next/head'
import React from 'react'

type Props = {
  title: string
  description?: string
}

export const HtmlHead = ({ title, description }: Props) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description || ''} />
    </Head>
  )
}
