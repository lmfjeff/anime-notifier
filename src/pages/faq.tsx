import React from 'react'
import { HtmlHead } from '../components/HtmlHead'
import { Markdown } from '../components/Markdown'
import Faq from '../mdx/Faq.mdx'

export default function Index() {
  return (
    <>
      <HtmlHead title="FAQ" />
      <Markdown>
        <Faq />
      </Markdown>
    </>
  )
}

Index.getTitle = 'FAQ'
