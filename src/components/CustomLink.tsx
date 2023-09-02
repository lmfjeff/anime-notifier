import NextLink, { LinkProps } from 'next/link'

type CustomLinkProps = LinkProps & { children: React.ReactNode }

export function Link({ href, prefetch = false, children, ...rest }: CustomLinkProps) {
  return (
    <NextLink href={href} prefetch={prefetch} {...rest}>
      {children}
    </NextLink>
  )
}
