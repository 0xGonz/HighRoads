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
      'inline-flex items-center justify-center font-semibold rounded-lg',
      // Smooth transitions for all effects
      'transition-all duration-250 ease-smooth',
      // Focus states
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      // Hover lift effect (subtle scale with shadow)
      'hover:scale-[1.015]',
      // Active press effect (scale down + press into page feel)
      'active:scale-[0.98] active:translate-y-[1px]',
      // Disabled states
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none'
    )

    const variants = {
      primary: cn(
        'bg-gradient-to-b from-accent to-accent-600 text-white shadow-soft focus:ring-accent',
        'hover:from-accent-500 hover:to-accent-600 hover:shadow-glow-accent',
        'active:from-accent-600 active:to-accent-700 active:shadow-soft'
      ),
      secondary: cn(
        'bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-soft focus:ring-primary',
        'hover:from-primary-500 hover:to-primary-600 hover:shadow-soft-lg',
        'active:from-primary-700 active:to-primary-800 active:shadow-soft'
      ),
      outline: cn(
        'border-2 border-primary-700 text-primary-700 bg-transparent focus:ring-primary',
        'hover:bg-primary-700 hover:text-white hover:shadow-soft',
        'active:bg-primary-800'
      ),
      ghost: cn(
        'text-primary-700 bg-transparent focus:ring-primary',
        'hover:bg-gray-100 hover:shadow-none',
        'active:bg-gray-200'
      ),
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
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
            {/* Improved loading spinner with dots */}
            <span className="relative flex h-5 w-5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-20" />
              <svg
                className="relative animate-spin h-5 w-5"
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
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            <span className="animate-pulse">Processing...</span>
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
