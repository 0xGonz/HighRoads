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
      // Traditional, professional styling
      'inline-flex items-center justify-center font-semibold',
      'rounded-lg', // Match form input rounding
      'transition-colors duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none'
    )

    const variants = {
      primary: cn(
        'bg-primary-800 text-white',
        'border border-primary-900',
        'focus-visible:ring-primary-500',
        'hover:bg-primary-900',
        'active:bg-primary-950'
      ),
      secondary: cn(
        'bg-accent-600 text-white',
        'border border-accent-700',
        'focus-visible:ring-accent-500',
        'hover:bg-accent-700',
        'active:bg-accent-800'
      ),
      outline: cn(
        'border border-primary-800 text-primary-800 bg-white focus-visible:ring-primary-500',
        'hover:bg-primary-50',
        'active:bg-primary-100'
      ),
      ghost: cn(
        'text-primary-800 bg-transparent focus-visible:ring-primary-500',
        'hover:bg-gray-100',
        'active:bg-gray-200'
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
