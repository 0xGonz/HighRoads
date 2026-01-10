import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full group">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1 transition-colors duration-200',
              error
                ? 'text-red-500'
                : 'text-gray-700 group-focus-within:text-primary-700'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full px-4 py-3 border-2 rounded-lg',
              'transition-all duration-250 ease-smooth',
              'focus:outline-none',
              'placeholder:text-gray-400',
              error
                ? 'border-red-400 focus:border-red-500 bg-red-50/50 animate-shake'
                : 'border-gray-200 hover:border-gray-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 focus:shadow-inner-soft',
              className
            )}
            {...props}
          />
          {/* Focus glow effect */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ease-smooth pointer-events-none bg-gradient-to-r from-primary-50 via-primary-50/50 to-transparent" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center animate-fade-in">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500 mr-2" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
