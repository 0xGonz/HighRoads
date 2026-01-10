import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = cn(
      // Base layout and typography
      'relative inline-flex items-center justify-center font-semibold rounded-lg',
      // Smooth transitions for all properties
      'transition-all duration-200 ease-out',
      // Focus states with ring animation
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      // Active/pressed state
      'active:scale-[0.98] active:transition-none',
      // Disabled states
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
      // Prevent text selection
      'select-none'
    )

    const variants = {
      primary: cn(
        // Premium navy gradient with subtle gold undertone
        'bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 text-white',
        'shadow-lg shadow-primary-900/25 focus-visible:ring-primary-500',
        'hover:from-primary-600 hover:via-primary-700 hover:to-primary-800',
        'hover:shadow-xl hover:shadow-primary-900/30 hover:-translate-y-0.5',
        'active:from-primary-800 active:via-primary-900 active:to-primary-950 active:shadow-lg'
      ),
      secondary: cn(
        // Gold accent for high-impact CTAs
        'bg-gradient-to-r from-accent-500 to-accent-600 text-white',
        'shadow-lg shadow-accent-500/25 focus-visible:ring-accent-400',
        'hover:from-accent-400 hover:to-accent-500 hover:shadow-xl hover:-translate-y-0.5',
        'active:from-accent-600 active:to-accent-700 active:shadow-lg'
      ),
      outline: cn(
        'border-2 border-primary-700 text-primary-700 bg-transparent focus-visible:ring-primary-500',
        'hover:bg-primary-700 hover:text-white hover:shadow-soft hover:-translate-y-0.5',
        'active:bg-primary-800 active:border-primary-800'
      ),
      ghost: cn(
        'text-primary-700 bg-transparent focus-visible:ring-primary-500',
        'hover:bg-primary-50',
        'active:bg-primary-100'
      ),
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
