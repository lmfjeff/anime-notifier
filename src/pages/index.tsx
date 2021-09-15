import React from 'react'
import { Markdown } from '../components/Markdown'
import Intro from '../mdx/Intro.mdx'

export default function Index() {
  return (
    <>
      <Markdown>
        <Intro />
      </Markdown>
    </>
  )
}

Index.getTitle = '首頁'
