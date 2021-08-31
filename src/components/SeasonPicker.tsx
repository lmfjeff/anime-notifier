import { Flex, Select } from '@chakra-ui/react'
import { range } from 'ramda'
import React from 'react'

type AnimeFilterProps = {
  queryParams: any
  onSelectSeason: (val: any) => void
}

const SeasonPicker = ({ queryParams, onSelectSeason }: AnimeFilterProps) => {
  const { year, season } = queryParams

  const yearList = range(2000, 2023)
    .map(number => number.toString())
    .reverse()
  const seasonList = ['winter', 'spring', 'summer', 'autumn']

  const selectYearOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value
    if (selectedYear === year) {
      return
    } else {
      onSelectSeason({ year: selectedYear, season })
    }
  }

  const selectSeasonOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSeason = e.target.value
    if (selectedSeason === season) {
      return
    } else {
      onSelectSeason({ year, season: selectedSeason })
    }
  }

  return (
    <Flex justifyContent="center" alignItems="center" wrap="wrap">
      <Select
        variant="filled"
        onChange={selectYearOnChange}
        defaultValue={year}
        border="1px"
        borderColor="gray"
        w={40}
        mx={1}
        my={1}
        size="sm"
      >
        {yearList.map(yearItem => (
          <option key={yearItem} value={yearItem}>
            {yearItem}
          </option>
        ))}
      </Select>
      <Select
        variant="filled"
        onChange={selectSeasonOnChange}
        defaultValue={season}
        border="1px"
        borderColor="gray"
        w={40}
        mx={1}
        my={1}
        size="sm"
      >
        {seasonList.map(seasonItem => (
          <option key={seasonItem}>{seasonItem}</option>
        ))}
      </Select>
    </Flex>
  )
}

export default SeasonPicker
