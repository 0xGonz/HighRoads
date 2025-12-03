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
                'relative flex items-start cursor-pointer p-4 border rounded-lg transition-colors',
                value === option.value
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-300 hover:border-gray-400',
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
                className="sr-only"
                {...props}
              />
              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  value === option.value ? 'border-accent' : 'border-gray-300'
                )}
              >
                {value === option.value && (
                  <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                )}
              </div>
              <div className="ml-3">
                <span className={cn(
                  'text-sm font-medium',
                  value === option.value ? 'text-accent' : 'text-gray-700'
                )}>
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup }
