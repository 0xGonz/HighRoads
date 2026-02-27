/**
 * Design System Tokens
 * Centralized color and styling definitions for consistent UI across the admin panel
 */

import type { ApplicantStatus } from '@/types/database'

// Status color mapping - used consistently across all views
export const statusColors: Record<ApplicantStatus, {
  bg: string
  text: string
  border: string
  icon: string
  light: string
  dot: string
}> = {
  new: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    light: 'bg-blue-50',
    dot: 'bg-blue-500',
  },
  in_progress: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    light: 'bg-amber-50',
    dot: 'bg-amber-500',
  },
  carrier_app: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    light: 'bg-purple-50',
    dot: 'bg-purple-500',
  },
  pending: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    light: 'bg-orange-50',
    dot: 'bg-orange-500',
  },
  complete: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: 'text-green-600',
    light: 'bg-green-50',
    dot: 'bg-green-500',
  },
  disqualified: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: 'text-red-600',
    light: 'bg-red-50',
    dot: 'bg-red-500',
  },
}

// Status labels for display
export const statusLabels: Record<ApplicantStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  carrier_app: 'Carrier App',
  pending: 'Pending',
  complete: 'Complete',
  disqualified: 'Disqualified',
}

// Helper function to get status styling
export function getStatusStyles(status: ApplicantStatus) {
  return statusColors[status] || statusColors.new
}

// Button variants
export const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'hover:bg-gray-100 text-gray-600 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  destructive: 'bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  destructiveGhost: 'text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
}

// Button sizes
export const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

// Input styling
export const inputStyles = {
  base: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 transition-colors',
  focus: 'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none',
  error: 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
  disabled: 'bg-gray-50 text-gray-500 cursor-not-allowed',
}

// Card styling
export const cardStyles = {
  base: 'bg-white rounded-xl shadow-sm',
  hover: 'hover:shadow-md transition-shadow',
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
}

// Badge styling for different purposes
export const badgeVariants = {
  // Status badges (pill-shaped)
  status: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
  // Info badges (box-shaped)
  info: 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
  // Dot indicator
  dot: 'inline-flex items-center gap-1.5 text-xs font-medium',
}

// Channel colors (email, sms)
export const channelColors = {
  email: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: 'text-blue-600',
    light: 'bg-blue-50',
  },
  sms: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: 'text-green-600',
    light: 'bg-green-50',
  },
}

// Spacing scale (consistent with Tailwind)
export const spacing = {
  section: 'space-y-6',
  card: 'space-y-4',
  form: 'space-y-4',
  inline: 'gap-3',
}

// Transition presets
export const transitions = {
  fast: 'transition-all duration-150 ease-in-out',
  default: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
}
