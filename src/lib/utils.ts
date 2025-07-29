import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'HEALTHY':
      return 'text-green-600 dark:text-green-400'
    case 'NEEDS_ATTENTION':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'SICK':
      return 'text-orange-600 dark:text-orange-400'
    case 'DECEASED':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'HEALTHY':
      return '🌱'
    case 'NEEDS_ATTENTION':
      return '⚠️'
    case 'SICK':
      return '🤒'
    case 'DECEASED':
      return '💀'
    default:
      return '❓'
  }
}