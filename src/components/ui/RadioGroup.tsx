import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
}

export interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  options: RadioOption[]
  orientation?: 'horizontal' | 'vertical'
}

const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ className, label, error, options, orientation = 'vertical', name, value, onChange, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div
          className={cn(
            'space-y-2',
            orientation === 'horizontal' && 'flex flex-wrap gap-4 space-y-0',
            className
          )}
        >
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                'relative flex items-start cursor-pointer p-4 border-2 rounded-xl',
                'transition-all duration-200 ease-out',
                'hover:scale-[1.01]',
                'focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2',
                value === option.value
                  ? 'border-primary-600 bg-primary-50 shadow-md shadow-primary-600/10'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50/50',
                orientation === 'horizontal' && 'flex-1 min-w-[150px]'
              )}
            >
              <input
                ref={ref}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="sr-only peer"
                {...props}
              />
              {/* Custom radio button */}
              <div
                className={cn(
                  'relative h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  'transition-all duration-200',
                  value === option.value
                    ? 'border-primary-600 bg-white'
                    : 'border-gray-300 group-hover:border-primary-400'
                )}
              >
                {/* Inner dot with scale animation */}
                <div
                  className={cn(
                    'h-2.5 w-2.5 rounded-full bg-primary-700',
                    'transition-all duration-200 ease-out',
                    value === option.value
                      ? 'scale-100 opacity-100'
                      : 'scale-0 opacity-0'
                  )}
                />
                {/* Pulse effect when selected */}
                {value === option.value && (
                  <span className="absolute inset-0 rounded-full bg-primary-200 animate-ping" style={{ animationDuration: '1s', animationIterationCount: '1' }} />
                )}
              </div>
              <div className="ml-3">
                <span className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  value === option.value ? 'text-primary-700' : 'text-gray-700'
                )}>
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                )}
              </div>
              {/* Selected indicator */}
              {value === option.value && (
                <div className="absolute top-3 right-3">
                  <svg
                    className="w-5 h-5 text-primary-700 animate-scale-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center animate-fade-in">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500 mr-2" />
            {error}
          </p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup }
