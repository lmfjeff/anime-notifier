import { Icon, IconButton } from '@chakra-ui/react'
import React from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

type FollowFilterProps = {
  followFilter: string | null
  setFollowFilter: React.Dispatch<React.SetStateAction<string | null>>
}

export const FollowFilter = ({ followFilter, setFollowFilter }: FollowFilterProps) => {
  const handleToggleFollowFilter = () => {
    switch (followFilter) {
      case null:
        setFollowFilter('hideUnfollowed')
        break
      case 'hideUnfollowed':
        setFollowFilter('hideFollowed')
        break
      case 'hideFollowed':
      default:
        setFollowFilter(null)
    }
  }
  return (
    <IconButton
      aria-label={
        followFilter
          ? followFilter === 'hideUnfollowed'
            ? 'set hide followed'
            : 'clear follow filter'
          : 'set hide unfollowed'
      }
      bg="white"
      icon={
        <Icon
          as={followFilter ? FaHeart : FaRegHeart}
          color={followFilter === 'hideUnfollowed' ? 'red.500' : 'gray'}
          boxSize="24px"
        />
      }
      onClick={handleToggleFollowFilter}
    />
  )
}
