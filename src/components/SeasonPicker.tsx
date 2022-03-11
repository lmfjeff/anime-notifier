import { Button, Flex, Grid, Icon, IconButton, Popover, PopoverContent, PopoverTrigger, Select } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { range } from 'ramda'
import React, { useState } from 'react'
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'
import { seasonOption, seasonTcOption } from '../constants/animeOption'
import { GetAnimesBySeasonRequest } from '../types/api'
import { nextSeason, pastSeason } from '../utils/date'

type SeasonPickerProps = {
  queryParams: GetAnimesBySeasonRequest
  onSelectSeason: (val: GetAnimesBySeasonRequest) => void
}

type SeasonButtonProps = {
  val: string
  text: string
  onClose?: () => void
  selectedYear: string | undefined
  queryParams: GetAnimesBySeasonRequest
  onSelectSeason: (val: GetAnimesBySeasonRequest) => void
}

const SeasonButton = ({ val, text, onClose, selectedYear, queryParams, onSelectSeason }: SeasonButtonProps) => {
  const { year, season } = queryParams
  return (
    <Button
      onClick={() => {
        if (val === season && selectedYear === year) {
          return
        } else {
          onClose && onClose()
          onSelectSeason({ year: selectedYear, season: val })
        }
      }}
      borderWidth={1}
      isActive={val === season && selectedYear === year}
      _active={{ bg: 'blue.200' }}
      bg={'transparent'}
      borderRadius={'sm'}
    >
      {text}
    </Button>
  )
}

export const SeasonPicker = ({ queryParams, onSelectSeason }: SeasonPickerProps) => {
  const { year, season } = queryParams
  const [selectedYear, setSelectedYear] = useState(year)

  const yearList = range(2020, dayjs().year() + 1)
    .map(number => number.toString())
    .reverse()

  return (
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        borderRadius={20}
        bg={'transparent'}
        mr={1}
        onClick={() => onSelectSeason(pastSeason(queryParams))}
        icon={<Icon as={AiFillCaretLeft} />}
        aria-label="previous season"
        title="上一季"
      />
      <Popover>
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Button borderRadius={'sm'} bg={'white'} borderWidth={1}>
                {year} {season ? seasonTcOption[season] : ''}
              </Button>
            </PopoverTrigger>
            <PopoverContent w={'fit-content'}>
              <Flex alignItems={'center'} p={1} gap={1}>
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
                <Grid gridTemplateColumns={'repeat(2, 1fr)'} gap={1}>
                  {seasonOption.map(sn => (
                    <SeasonButton
                      key={sn}
                      val={sn}
                      text={seasonTcOption[sn]}
                      onClose={onClose}
                      selectedYear={selectedYear}
                      queryParams={queryParams}
                      onSelectSeason={onSelectSeason}
                    />
                  ))}
                </Grid>
              </Flex>
            </PopoverContent>
          </>
        )}
      </Popover>
      <IconButton
        borderRadius={20}
        bg={'transparent'}
        ml={1}
        onClick={() => onSelectSeason(nextSeason(queryParams))}
        icon={<Icon as={AiFillCaretRight} />}
        aria-label="next season"
        title="下一季"
      />
    </Flex>
  )
}
