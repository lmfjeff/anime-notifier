import { Flex, Select } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { range } from 'ramda'
import React from 'react'

type AnimeFilterProps = {
  params: any
}

// todo move router to page /anime/[year]/[season]

const AnimeFilter = ({ params }: AnimeFilterProps) => {
  const router = useRouter()
  const { year, season } = params
  const yearList = range(2000, 2023)
    .map(number => number.toString())
    .reverse()
  const seasonList = ['WINTER', 'SPRING', 'SUMMER', 'FALL', 'UNDEFINED']

  const selectYearOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value
    if (selectedYear === year) {
      return
    } else {
      router.push(`/anime/${selectedYear}/${season}`)
    }
  }

  const selectSeasonOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSeason = e.target.value
    if (selectedSeason === season) {
      return
    } else {
      router.push(`/anime/${year}/${selectedSeason}`)
    }
  }

  return (
    <Flex>
      <Select variant="filled" onChange={selectYearOnChange} defaultValue={year}>
        {yearList.map(yearItem => (
          <option key={yearItem} value={yearItem}>
            {yearItem}
          </option>
        ))}
      </Select>
      <Select variant="filled" onChange={selectSeasonOnChange} defaultValue={season}>
        {seasonList.map(seasonItem => (
          <option key={seasonItem}>{seasonItem}</option>
        ))}
      </Select>
    </Flex>
  )
}

export default AnimeFilter
