import { any, is } from 'ramda'

export function anyTrue(a: any): boolean {
  if (is(Boolean, a)) return a
  if (is(Array, a)) return any(val => anyTrue(val), a)
  if (is(Object, a)) return any(val => anyTrue(val), Object.values(a))
  return false
}

export const exclude = <T, Key extends keyof T>(model: T, ...keys: Key[]): Omit<T, Key> => {
  if (!model) throw new Error('Model arg is missing.')

  for (const key of keys) {
    delete model[key]
  }
  return model
}
