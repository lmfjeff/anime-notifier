/* eslint-disable react/display-name */
import { chakra, Text, Heading, Image, Divider } from '@chakra-ui/react'
import { MDXProvider } from '@mdx-js/react'
import { ReactNode } from 'react'

export const Markdown: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MDXProvider
    components={{
      // https://mdxjs.com/table-of-components
      // https://nextjs.org/blog/markdown
      img: Image,
      h1: p => <Heading my={6} as="h1" {...p} />,
      h2: p => <Heading my={4} as="h2" size="lg" {...p} />,
      h3: p => <Heading mt={4} mb={2} as="h3" size="md" {...p} />,
      h4: p => <Heading my={2} as="h4" size="sm" {...p} />,
      h5: p => <Heading as="h5" size="xs" {...p} />,
      p: p => <Text as="p" mb={1} {...p} />,
      ol: p => <chakra.ol sx={{ listStylePosition: 'outside' }} {...p} />,
      ul: p => <chakra.ul sx={{ listStylePosition: 'outside' }} pl={5} {...p} />,
      hr: p => <Divider {...p} />,
      a: p => {
        return (
          <chakra.a
            target={p?.href?.includes('http') ? '_blank' : '_self'}
            color="gray"
            borderColor="gray"
            borderBottomWidth="1px"
            borderStyle="dotted"
            _hover={{
              color: 'black',
              borderBottomWidth: '2px',
              borderColor: 'black',
            }}
            {...p}
          />
        )
      },
    }}
  >
    {children}
  </MDXProvider>
)
