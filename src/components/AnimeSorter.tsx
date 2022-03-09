import { Box, Button, Flex, HStack, Text, useRadio, useRadioGroup } from '@chakra-ui/react'
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
  return (
    <Flex justifyContent="center" alignItems="center" wrap="wrap" gap={2}>
      <Text fontSize="lg">排序:</Text>
      <SortButton val="weekly" text="星期" sort={sort} setSort={setSort} />
      <SortButton val="compact" text="無排序" sort={sort} setSort={setSort} />
    </Flex>
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
