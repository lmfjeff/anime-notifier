import {
  Box,
  Button,
  ButtonProps,
  Flex,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Text,
  useDisclosure,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react'
import React from 'react'

type AnimeSorterProps = {
  sort: string
  setSort?: (v: string) => void
}

type SortButtonProps = ButtonProps & {
  val: string
  text: string
  sort: string
  setSort?: (v: string) => void
}

export const AnimeSorter = ({ sort, setSort }: AnimeSorterProps) => {
  const sortOptions = [
    { val: 'weekly', text: '星期' },
    { val: 'compact', text: '無排序' },
    { val: 'mal_score', text: 'MAL評分' },
    { val: 'score', text: '本站評分' },
  ]
  return (
    <>
      <Flex justifyContent="center" alignItems="center" wrap="wrap" gap={2} display={['none', null, null, 'flex']}>
        <Text fontSize="lg">排序:</Text>
        {sortOptions.map(({ val, text }) => (
          <SortButton key={val} val={val} text={text} sort={sort} setSort={setSort} boxShadow="0 0 3px gray" />
        ))}
      </Flex>
      <Flex alignItems="center" gap={2} display={['flex', null, null, 'none']}>
        <Text wordBreak={'keep-all'} fontSize="lg">
          排序:
        </Text>
        <Popover gutter={0}>
          <PopoverTrigger>
            <Button borderRadius={'sm'} bg="white" borderWidth={1} width="100px">
              {sortOptions.find(s => s.val === sort)?.text}
            </Button>
          </PopoverTrigger>
          <PopoverContent w="fit-content">
            <Flex flexDir={'column'}>
              {sortOptions.map(({ val, text }) => (
                <SortButton key={val} val={val} text={text} sort={sort} setSort={setSort} />
              ))}
            </Flex>
          </PopoverContent>
        </Popover>
      </Flex>
    </>
  )
}

const SortButton = ({ val, text, sort, setSort, ...props }: SortButtonProps) => (
  <Button
    onClick={() => {
      if (setSort) setSort(val)
    }}
    bg={sort === val ? 'blue.200' : 'white'}
    _hover={{ bg: sort === val ? 'blue.200' : 'blue.100' }}
    _active={{ bg: 'blue.200' }}
    borderRadius={'sm'}
    {...props}
  >
    {text}
  </Button>
)
