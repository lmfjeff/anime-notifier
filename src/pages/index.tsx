import React from 'react'
import { HtmlHead } from '../components/HtmlHead'
import { Markdown } from '../components/Markdown'
import Intro from '../mdx/Intro.mdx'

export default function Index() {
  return (
    <>
      <HtmlHead title="動畫新番網" />
      <Markdown>
        <Intro />
      </Markdown>
    </>
  )
}

Index.getTitle = '首頁'
