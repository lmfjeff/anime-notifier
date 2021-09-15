import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  useFormControl,
  Select,
} from '@chakra-ui/react'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { sourceOption, statusOption, typeOption, weekdayOption } from '../constants/animeOption'

type Inputs = {
  // anime: {
  //   yearSeason: string
  //   title: string
  //   picture: string
  //   alternative_titles: { [key: string]: any }
  //   startDate: string
  //   endDate: string
  //   summary: string
  //   genres: string[]
  //   type: string
  //   status: string
  //   dayOfWeek: string
  //   time: string
  //   source: string
  //   studios: string[]
  // }
  anime: { [key: string]: any }
  submitFn: (a: any) => void
}

export const AnimeForm = ({ anime, submitFn }: Inputs) => {
  const {
    id,
    yearSeason,
    title,
    picture,
    alternative_titles,
    startDate,
    endDate,
    summary,
    genres,
    type,
    status,
    dayOfWeek,
    time,
    source,
    studios,
  } = anime

  console.log()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const onSubmit = (anime: any) => {
    submitFn(anime)
    // console.log(anime)
  }

  type ItemProps = {
    animeKey: string
  }
  const Item: React.FC<ItemProps> = ({ animeKey, children }) => {
    return (
      <FormControl isInvalid={!!errors[animeKey]} id={animeKey}>
        <FormLabel>{animeKey}</FormLabel>
        {children}
        <FormErrorMessage>{errors[animeKey] && errors[animeKey].message}</FormErrorMessage>
      </FormControl>
    )
  }

  // console.log(watch('name'))

  // form control: isInvalid, input required

  return (
    <Container border="1px" borderRadius={5} borderColor="gray" p={5} maxW="container.sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Item animeKey="yearSeason">
          <Input defaultValue={yearSeason} {...register('yearSeason')} />
        </Item>

        <Item animeKey="title">
          <Input defaultValue={title} {...register('title')} />
        </Item>

        <Item animeKey="picture">
          <Input defaultValue={picture} {...register('picture')} />
        </Item>

        <Item animeKey="startDate">
          <Input defaultValue={startDate} {...register('startDate')} />
        </Item>

        <Item animeKey="endDate">
          <Input defaultValue={endDate} {...register('endDate')} />
        </Item>

        <Item animeKey="summary">
          <Input as="textarea" h="200px" defaultValue={summary} {...register('summary')} />
        </Item>

        <Item animeKey="type">
          <Select placeholder=" " defaultValue={type} {...register('type')}>
            {typeOption.map(val => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </Select>
        </Item>

        <Item animeKey="status">
          <Select placeholder=" " defaultValue={status} {...register('status')}>
            {statusOption.map(val => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </Select>
        </Item>

        <Item animeKey="dayOfWeek">
          <Select placeholder=" " defaultValue={dayOfWeek} {...register('dayOfWeek')}>
            {weekdayOption.map(val => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </Select>
        </Item>

        <Item animeKey="time">
          <Input defaultValue={time} {...register('time')} />
        </Item>

        <Item animeKey="source">
          <Select placeholder=" " defaultValue={source} {...register('source')}>
            {sourceOption.map(val => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </Select>
        </Item>

        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </Container>
  )
}
