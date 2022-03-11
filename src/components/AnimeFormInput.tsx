import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputProps,
  Select,
  Text,
} from '@chakra-ui/react'
import { Control, FieldValues, useFieldArray, UseFormRegister } from 'react-hook-form'

type StringArrayInputProps = {
  label: string
  required?: string
  register: UseFormRegister<FieldValues>
  errors: Record<string, any>
  control: Control<FieldValues, object>
}

type SingleInputProps = {
  label: string
  required?: string
  options?: string[]
  register: UseFormRegister<FieldValues>
  errors: Record<string, any>
}

export const StringArrayInput: React.FC<StringArrayInputProps> = ({ label, required, register, errors, control }) => {
  // cater for one-layer nest object with string value
  const tmp = label.split('.')
  const errorsLabel = tmp.length === 2 ? errors?.[tmp[0]]?.[tmp[1]] : errors?.[label]

  const { fields, append, remove } = useFieldArray({ control, name: label })
  return (
    <FormControl isInvalid={!!errorsLabel} mb={5}>
      <Flex wrap={'wrap'}>
        <Flex w={'250px'}>
          <FormLabel>{label}</FormLabel>
        </Flex>
        <Flex flexDir={'column'} flexGrow={1} gap={2} w={'300px'}>
          {fields.map((field, index) => (
            <div key={field.id}>
              <Flex>
                <Input {...register(`${label}.${index}` as const, { required })} borderColor={'gray'} />
                <IconButton
                  bg={'white'}
                  onClick={() => remove(index)}
                  icon={<CloseIcon />}
                  title="刪除"
                  aria-label="delete"
                />
              </Flex>
              <FormErrorMessage>{errorsLabel?.[index] && errorsLabel?.[index].message}</FormErrorMessage>
            </div>
          ))}
          <IconButton
            alignSelf={'center'}
            bg={'white'}
            w={'100px'}
            onClick={() => append('')}
            icon={<AddIcon />}
            title="新增"
            aria-label="add"
          />
        </Flex>
      </Flex>
    </FormControl>
  )
}

export const StringInput: React.FC<InputProps & SingleInputProps> = ({
  label,
  required,
  register,
  errors,
  ...props
}) => {
  // cater for one-layer nest object with string value
  const tmp = label.split('.')
  const errorsLabel = tmp.length === 2 ? errors?.[tmp[0]]?.[tmp[1]] : errors?.[label]
  return (
    <FormControl isInvalid={!!errorsLabel} mb={5}>
      <Flex wrap={'wrap'}>
        <Flex flexDir={'row'} w={'250px'}>
          <FormLabel>{label}</FormLabel>
          {required && <Text color={'red'}>*</Text>}
        </Flex>
        <Flex flexDir={'column'} flexGrow={1} w={'300px'}>
          <Input {...register(label, { required })} {...props} borderColor={'gray'} />
          <FormErrorMessage>{errorsLabel && errorsLabel?.message}</FormErrorMessage>
        </Flex>
      </Flex>
    </FormControl>
  )
}

export const SelectInput: React.FC<SingleInputProps> = ({ label, required, register, errors, options }) => {
  return (
    <FormControl isInvalid={!!errors?.[label]} mb={5}>
      <Flex wrap={'wrap'}>
        <Flex flexDir={'row'} w={'250px'}>
          <FormLabel>{label}</FormLabel>
          {required && <Text color={'red'}>*</Text>}
        </Flex>
        <Flex flexDir={'column'} flexGrow={1} w={'300px'}>
          <Select {...register(label, { required })} placeholder={required ? '' : ' '} borderColor={'gray'}>
            {options &&
              options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </Select>
          <FormErrorMessage>{errors?.[label] && errors?.[label]?.message}</FormErrorMessage>
        </Flex>
      </Flex>
    </FormControl>
  )
}
