import Head from 'next/head'
import React from 'react'

type HeadProps = {
  title: string
  description?: string
}

export const HtmlHead = ({ title, description }: HeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description || ''} />
    </Head>
  )
}
