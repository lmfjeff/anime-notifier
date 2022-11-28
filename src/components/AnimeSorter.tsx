import { Box, Button, Flex, HStack, Select, Text, useRadio, useRadioGroup } from '@chakra-ui/react'
import React from 'react'

type AnimeSorterProps = {
  sort: string
  setSort: React.Dispatch<React.SetStateAction<string>>
}

type SortButtonProps = {
  val: string
  text: string
  sort: string
  setSort: React.Dispatch<React.SetStateAction<string>>
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
          <SortButton key={val} val={val} text={text} sort={sort} setSort={setSort} />
        ))}
      </Flex>
      <Flex alignItems="center" gap={2} display={['flex', null, null, 'none']}>
        <Text wordBreak={'keep-all'} fontSize="lg">
          排序:
        </Text>
        <Box>
          <Select
            value={sort}
            onChange={e => {
              setSort(e.target.value)
            }}
          >
            {sortOptions.map(({ val, text }) => (
              <option key={val} value={val}>
                {text}
              </option>
            ))}
          </Select>
        </Box>
      </Flex>
    </>
  )
}

const SortButton = ({ val, text, sort, setSort }: SortButtonProps) => (
  <Button
    onClick={() => setSort(val)}
    boxShadow="0 0 3px gray"
    isActive={sort === val}
    _active={{ bg: 'blue.200' }}
    borderRadius={'sm'}
  >
    {text}
  </Button>
)
