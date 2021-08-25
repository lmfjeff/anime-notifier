import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  useFormControl,
} from '@chakra-ui/react'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

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

export default function AnimeForm({ anime, submitFn }: Inputs) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const onSubmit = (anime: any) => {
    submitFn(anime)
  }

  const formControl = (key: string, val: string) => (
    <FormControl isInvalid={!!errors[key]} key={key}>
      <FormLabel htmlFor={key}>{key}</FormLabel>
      <Input id={key} {...register(key)} defaultValue={val} />
      <FormErrorMessage>{errors[key] && errors[key].message}</FormErrorMessage>
    </FormControl>
  )

  // console.log(watch('name'))

  // form control: isInvalid, input required

  return (
    <Container border="1px" borderRadius={5} borderColor="gray" p={5}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* {Object.entries(anime).map(([key, val]) =>
          typeof val === 'string' && (key === 'title' || 'summary') ? formControl(key, val) : null
        )} */}
        {formControl('id', anime.id)}
        {formControl('title', anime.title)}
        {formControl('summary', anime.summary)}
        {formControl('yearSeason', anime.yearSeason)}
        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </Container>
  )
}
