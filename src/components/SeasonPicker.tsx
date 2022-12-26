import {
  Button,
  ButtonProps,
  Flex,
  Grid,
  Icon,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
} from '@chakra-ui/react'
import { range } from 'ramda'
import React, { useState } from 'react'
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs'
import { IconType } from 'react-icons/lib'
import { seasonOption, seasonTcOption } from '../constants/animeOption'
import { GetAnimesBySeasonRequest } from '../types/api'
import { gethkNow, nextSeason, pastSeason } from '../utils/date'

type SeasonPickerProps = {
  queryParams: GetAnimesBySeasonRequest
  onSelectSeason: (val: GetAnimesBySeasonRequest) => void
}

type SeasonButtonProps = {
  val: string
  text: string
  selectedYear: string | undefined
  queryParams: GetAnimesBySeasonRequest
  onSelectSeason: (val: GetAnimesBySeasonRequest) => void
}

type ArrowButtonProps = ButtonProps & {
  onClick: () => void
  icon: IconType
  title: string
}

const SeasonButton = ({ val, text, selectedYear, queryParams, onSelectSeason }: SeasonButtonProps) => {
  const { year, season } = queryParams
  const isChecked = val === season && selectedYear === year
  return (
    <Button
      onClick={() => {
        if (val === season && selectedYear === year) {
          return
        } else {
          onSelectSeason({ year: selectedYear, season: val })
        }
      }}
      borderWidth={1}
      bg={isChecked ? 'blue.200' : 'transparent'}
      _hover={{ bg: isChecked ? 'blue.200' : 'blue.100' }}
      _active={{ bg: 'blue.200' }}
      borderRadius={'sm'}
    >
      {text}
    </Button>
  )
}

export const SeasonPicker = ({ queryParams, onSelectSeason }: SeasonPickerProps) => {
  const { year, season } = queryParams
  const [selectedYear, setSelectedYear] = useState(year)

  const yearList = range(2020, gethkNow().add(3, 'month').year() + 1)
    .map(number => number.toString())
    .reverse()

  return (
    <Flex justifyContent="center" alignItems="center">
      <ArrowButton
        onClick={() => onSelectSeason(pastSeason(queryParams))}
        icon={BsFillCaretLeftFill}
        title="上一季"
        mr={1}
        display={['none', 'inline-flex']}
      />
      <Popover>
        <PopoverTrigger>
          <Button
            borderRadius={'sm'}
            bg={'white'}
            _hover={{ bg: 'blue.100' }}
            _active={{ bg: 'blue.200' }}
            borderWidth={1}
          >
            {year} {season ? seasonTcOption[season] : ''}
          </Button>
        </PopoverTrigger>
        <PopoverContent w={'fit-content'}>
          <Flex alignItems={'center'} p={1} gap={1}>
            <Flex flexDir={'column'} gap={1}>
              <Select
                w={'fit-content'}
                variant={'outline'}
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                borderRadius={'sm'}
              >
                {yearList.map(yearItem => (
                  <option key={yearItem} value={yearItem}>
                    {yearItem}
                  </option>
                ))}
              </Select>
              <Flex gap={1} justifyContent="center">
                <ArrowButton
                  onClick={() => onSelectSeason(pastSeason(queryParams))}
                  icon={BsFillCaretLeftFill}
                  title="上一季"
                  display={['block', 'none']}
                  lineHeight={0}
                />
                <ArrowButton
                  onClick={() => onSelectSeason(nextSeason(queryParams))}
                  icon={BsFillCaretRightFill}
                  title="下一季"
                  display={['block', 'none']}
                  lineHeight={0}
                />
              </Flex>
            </Flex>
            <Grid gridTemplateColumns={'repeat(2, 1fr)'} gap={1}>
              {seasonOption.map(sn => (
                <SeasonButton
                  key={sn}
                  val={sn}
                  text={seasonTcOption[sn]}
                  selectedYear={selectedYear}
                  queryParams={queryParams}
                  onSelectSeason={onSelectSeason}
                />
              ))}
            </Grid>
          </Flex>
        </PopoverContent>
      </Popover>
      <ArrowButton
        onClick={() => onSelectSeason(nextSeason(queryParams))}
        icon={BsFillCaretRightFill}
        title="下一季"
        ml={1}
        display={['none', 'inline-flex']}
      />
    </Flex>
  )
}

const ArrowButton = ({ onClick, icon, title, ...props }: ArrowButtonProps) => (
  <IconButton
    borderRadius={20}
    borderWidth={1}
    bg={'white'}
    _hover={{ bg: 'blue.100' }}
    _active={{ bg: 'blue.200' }}
    onClick={onClick}
    icon={<Icon as={icon} />}
    aria-label={title}
    title={title}
    {...props}
  />
)
