import type { Order } from '@/api/types'

const BASE_BADGE_CLASSES =
  'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150'

const REASON_STYLES: Record<
  string,
  { label: string; classes: string }
> = {
  scheduled: {
    label: 'Scheduled',
    classes: `${BASE_BADGE_CLASSES} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700`,
  },
  dip: {
    label: 'Dip Buy',
    classes: `${BASE_BADGE_CLASSES} bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700`,
  },
}

const formatLabel = (reason: string): string => {
  return reason
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const formatOrderReason = (reason: Order['reason']): string => {
  if (!reason) return '—'
  const normalized = reason.toString().trim()
  if (!normalized) return '—'
  const key = normalized.toLowerCase()
  return REASON_STYLES[key]?.label ?? formatLabel(normalized)
}

export const getOrderReasonBadgeClasses = (reason: Order['reason']): string => {
  if (!reason) {
    return `${BASE_BADGE_CLASSES} bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/70 dark:text-gray-300 dark:border-gray-700`
  }

  const key = reason.toString().trim().toLowerCase()
  return (
    REASON_STYLES[key]?.classes ??
    `${BASE_BADGE_CLASSES} bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/70 dark:text-gray-300 dark:border-gray-700`
  )
}


