import type { ApplicantStatus } from '@/types/database'
import { statusColors, statusLabels, badgeVariants } from '@/lib/design-tokens'

interface StatusBadgeProps {
  status: ApplicantStatus
  size?: 'sm' | 'md'
  variant?: 'badge' | 'dot'
}

export function StatusBadge({ status, size = 'md', variant = 'badge' }: StatusBadgeProps) {
  const colors = statusColors[status] || statusColors.new
  const label = statusLabels[status] || 'Unknown'

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'

  if (variant === 'dot') {
    return (
      <span className={badgeVariants.dot}>
        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
        <span className={colors.text}>{label}</span>
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${colors.bg} ${colors.text} ${sizeClasses}`}
    >
      {label}
    </span>
  )
}
