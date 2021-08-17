export function getDayOfWeekFromString(s: string) {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return dayOfWeek.indexOf(s) + 1
}

export function compareDayOfWeek(a: any, b: any) {
  if (a.dayOfWeek === b.dayOfWeek) return a.time > b.time ? 1 : -1
  return getDayOfWeekFromString(a.dayOfWeek) - getDayOfWeekFromString(b.dayOfWeek)
}
