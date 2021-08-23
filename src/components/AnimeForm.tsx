import { Button, Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  title: string
  year: number
  season: string
  picture: string
  startDate: string
  endDate: string
  summary: string
  genres: string
  type: string
  status: string
  dayOfWeek: string
  time: string
  source: string
  studio: string
}

export default function AnimeForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data)

  // console.log(watch('name'))

  return (
    <Container border="1px" borderRadius={5} borderColor="gray" p={5}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            {...register('title', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
          <FormHelperText>We will never share your email.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="year">Year</FormLabel>
          <Input id="year" />
        </FormControl>

        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </Container>
  )
}
