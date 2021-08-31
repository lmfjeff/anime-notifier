import { Box, Button, Flex, HStack, Text, useRadio, useRadioGroup } from '@chakra-ui/react'
import React from 'react'

type Props = {
  sort: string
  setSort: React.Dispatch<React.SetStateAction<string>>
}

type SortButtonProps = {
  val: string
  text: string
}

const AnimeSorter = ({ sort, setSort }: Props) => {
  const SortButton = ({ val, text }: SortButtonProps) => (
    <Button
      onClick={() => setSort(val)}
      mx={1}
      my={1}
      boxShadow="0 0 3px gray"
      isActive={sort === val}
      _active={{ bg: 'blue.200' }}
    >
      {text}
    </Button>
  )

  return (
    <Flex justifyContent="center" alignItems="center" wrap="wrap">
      <Text mx={3} fontSize="lg">
        排序:
      </Text>
      <SortButton val="weekly" text="星期" />
      <SortButton val="compact" text="無排序" />
    </Flex>
  )
}

export default AnimeSorter
