import { any, is } from 'ramda'

export function anyTrue(a: any): boolean {
  if (is(Boolean, a)) return a
  if (is(Array, a)) return any(val => anyTrue(val), a)
  if (is(Object, a)) return any(val => anyTrue(val), Object.values(a))
  return false
}
