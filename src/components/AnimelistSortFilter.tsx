import { Box, Flex, Text } from '@chakra-ui/react'
import { WATCH_STATUS_DISPLAY_NAME, WATCH_STATUS_OPTIONS } from '../constants/followOption'
import { FaLongArrowAltUp, FaLongArrowAltDown, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

type AnimelistSortFilterProps = {
  sort: string
  setSort: React.Dispatch<React.SetStateAction<string>>
  sortOrder: string
  setSortOrder: React.Dispatch<React.SetStateAction<string>>
  statusFilter: string
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>
}

export const AnimelistSortFilter = ({
  sort,
  setSort,
  sortOrder,
  setSortOrder,
  statusFilter,
  setStatusFilter,
}: AnimelistSortFilterProps) => {
  const sortOptions = {
    updatedAt: '更新',
    score: '評分',
  }
  const watchStatusOptions = [...WATCH_STATUS_OPTIONS, 'all']
  const watchStatusDisplayName: Record<string, string> = {
    ...WATCH_STATUS_DISPLAY_NAME,
    all: '所有',
  }
  return (
    <Flex mb={5} flexDir="column" align="center">
      <Flex mb={2}>
        {watchStatusOptions.map((status, index) => (
          <Box
            cursor="pointer"
            py={2}
            px={3}
            key={status}
            border="1px solid grey"
            borderLeft={index === 0 ? '1px solid grey' : 'none'}
            bg={status === statusFilter ? 'hsl(216, 68%, 42%)' : 'unset'}
            color={status === statusFilter ? 'white' : 'unset'}
            onClick={() => setStatusFilter(status)}
          >
            {watchStatusDisplayName[status]}
          </Box>
        ))}
      </Flex>
      <Flex align="center">
        <Text mr={3}>排序</Text>
        {Object.entries(sortOptions).map(([sortOpt, sortOptName], index) => (
          <Flex
            key={sortOpt}
            cursor="pointer"
            py={2}
            px={3}
            border="1px solid grey"
            borderLeft={index === 0 ? '1px solid grey' : 'none'}
            align="center"
            bg={sort === sortOpt ? 'hsl(216, 68%, 42%)' : 'unset'}
            color={sort === sortOpt ? 'white' : 'unset'}
            onClick={() => {
              if (sort === sortOpt) {
                setSortOrder(old => (old === 'asc' ? 'desc' : 'asc'))
              } else {
                setSort(sortOpt)
                setSortOrder('desc')
              }
            }}
          >
            <Text>{sortOptName}</Text>
            {sort === sortOpt ? sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown /> : <FaSort color="grey" />}
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
