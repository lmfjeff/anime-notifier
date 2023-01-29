import {
  Button,
  ButtonProps,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

type FollowFilterProps = {
  followFilter: string | null
  setFollowFilter?: (v: string | null) => void
}

type FilterButtonProps = ButtonProps & {
  val: string | null
  text: string
  followFilter: string | null
  setFollowFilter?: (v: string | null) => void
  icon: IconType
}

export const FollowFilter = ({ followFilter, setFollowFilter }: FollowFilterProps) => {
  const filterOptions = [
    { val: null, text: '所有', icon: FaRegHeart, color: 'gray' },
    { val: 'hideUnfollowed', text: '已追', icon: FaHeart, color: 'red.500' },
    { val: 'hideFollowed', text: '無追', icon: FaHeart, color: 'gray' },
  ]
  return (
    <Popover gutter={0}>
      <PopoverTrigger>
        <IconButton
          aria-label="Follow Filter"
          bg="white"
          _hover={{ bg: 'blue.100' }}
          _active={{ bg: 'blue.200' }}
          borderRadius={'sm'}
          icon={
            <Icon
              as={followFilter ? FaHeart : FaRegHeart}
              color={followFilter === 'hideUnfollowed' ? 'red.500' : 'gray'}
              boxSize="24px"
            />
          }
        />
      </PopoverTrigger>
      <PopoverContent w="fit-content">
        {filterOptions.map(({ val, text, icon, color }) => (
          <FilterButton
            key={text}
            val={val}
            text={text}
            followFilter={followFilter}
            setFollowFilter={setFollowFilter}
            icon={icon}
            color={color}
          />
        ))}
      </PopoverContent>
    </Popover>
  )
}

const FilterButton = ({ val, text, followFilter, setFollowFilter, icon, ...props }: FilterButtonProps) => (
  <Button
    onClick={() => {
      if (setFollowFilter) setFollowFilter(val)
    }}
    bg={followFilter === val ? 'blue.200' : 'white'}
    _hover={{ bg: followFilter === val ? 'blue.200' : 'blue.100' }}
    _active={{ bg: 'blue.200' }}
    borderRadius={'sm'}
    leftIcon={<Icon as={icon} boxSize="24px" />}
    {...props}
  >
    {text}
  </Button>
)
