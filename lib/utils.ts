import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPageFromTo(page: number, pageSize: number) {
  let from = page * pageSize - 1
  const to = from + pageSize

  if (page > 0) {
    from += 1
  }

  return { from, to }
}
