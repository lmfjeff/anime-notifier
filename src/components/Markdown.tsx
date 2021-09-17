/* eslint-disable react/display-name */
import { chakra, Box, Flex, Text, Heading, Image } from '@chakra-ui/react'
import { MDXProvider } from '@mdx-js/react'

export const Markdown: React.FC = ({ children }) => (
  <MDXProvider
    components={{
      // https://mdxjs.com/table-of-components
      // https://nextjs.org/blog/markdown
      img: Image,
      h1: p => <Heading my={6} as="h1" {...p} />,
      h2: p => <Heading my={4} as="h2" size="lg" {...p} />,
      h3: p => <Heading as="h3" size="md" mt={4} mb={2} {...p} />,
      h4: p => <Heading as="h4" size="sm" my={2} {...p} />,
      h5: p => <Heading as="h5" size="xs" {...p} />,
      ol: p => <chakra.ol sx={{ listStylePosition: 'inside' }} {...p} />,
      p: p => <Text as="p" mb={2} {...p} />,
      a: p => (
        <chakra.a
          color="green"
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
      ),
    }}
  >
    {children}
  </MDXProvider>
)