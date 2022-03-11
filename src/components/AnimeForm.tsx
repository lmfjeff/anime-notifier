import { Button, Container, Text } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { sourceOption, statusOption, typeOption, weekdayOption } from '../constants/animeOption'
import { anyTrue } from '../utils/utils'
import { filter, pick, isEmpty } from 'ramda'
import { SelectInput, StringArrayInput, StringInput } from './AnimeFormInput'

type AnimeFormProps = {
  anime: Record<string, any>
  submitFn: (anime: Record<string, any>) => Promise<void>
}

export const AnimeForm = ({ anime, submitFn }: AnimeFormProps) => {
  const { id } = anime

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    control,
  } = useForm({ defaultValues: anime })

  const onSubmit = (data: Record<string, any>) => {
    // if edit, only send modified field
    if (id) {
      const df = filter(anyTrue, dirtyFields)
      const updateItem = pick(Object.keys(df), data)
      // if no change, return
      if (isEmpty(updateItem)) {
        return
      }
      submitFn({ ...updateItem, id })
    } else {
      // if create, send all data
      submitFn(data)
    }
  }

  const customInputProps = { register, errors }
  const customStringInputProps = { register, errors, control }

  // todo dirty field highlight
  // todo adding hint for string input

  return (
    <Container border="1px" borderRadius={5} borderColor="gray" p={5} maxW="container.md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <StringInput label="yearSeason" required="year season is required" {...customInputProps} />
        <StringInput label="title" required="title is required" {...customInputProps} />
        <StringInput label="picture" {...customInputProps} />
        <SelectInput label="type" options={typeOption} required="type is required" {...customInputProps} />
        <SelectInput label="status" options={statusOption} required="status is required" {...customInputProps} />
        <SelectInput label="dayOfWeek" options={weekdayOption.slice(0, -1)} {...customInputProps} />
        <StringInput label="time" {...customInputProps} />

        <StringInput label="alternative_titles.en" {...customInputProps} />
        <StringInput label="alternative_titles.ja" {...customInputProps} />
        <StringArrayInput
          label="alternative_titles.synonyms"
          required="cannot be empty string"
          {...customStringInputProps}
        />
        <StringInput label="startDate" {...customInputProps} />
        <StringInput label="endDate" {...customInputProps} />
        <StringInput label="summary" as={'textarea'} h={'200px'} {...customInputProps} />
        <StringArrayInput label="genres" required="cannot be empty string" {...customStringInputProps} />
        <SelectInput label="source" options={sourceOption} {...customInputProps} />
        <StringArrayInput label="studios" required="cannot be empty string" {...customStringInputProps} />
        <Button mt={4} mb={2} isLoading={isSubmitting} type="submit" bg={'white'} disabled={isEmpty(dirtyFields)}>
          Submit
        </Button>
        {isEmpty(dirtyFields) && <Text fontSize={'x-small'}>Change field to submit</Text>}
      </form>
    </Container>
  )
}
