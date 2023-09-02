import React from 'react'
import { useRouter } from 'next/router'

type CustomLinkProps = { href: string; children: React.ReactNode }

export const Link = ({ href, children }: CustomLinkProps) => {
  const router = useRouter()
  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    await router.push(href)
  }
  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  )
}
