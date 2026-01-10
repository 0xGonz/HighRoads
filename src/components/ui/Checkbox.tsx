import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex items-start group">
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn(
              'peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2',
              'checked:bg-primary-700 checked:border-primary-700',
              error ? 'border-red-500' : 'border-gray-300 hover:border-primary-400',
              className
            )}
            {...props}
          />
          {/* Animated checkmark */}
          <Check
            className={cn(
              'absolute h-4 w-4 text-white pointer-events-none left-1',
              'opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100',
              'transition-all duration-200 ease-out'
            )}
            strokeWidth={3}
          />
        </div>
        <label
          htmlFor={checkboxId}
          className={cn(
            'ml-3 cursor-pointer text-sm transition-colors duration-200',
            'group-hover:text-gray-900',
            error ? 'text-red-500' : 'text-gray-700'
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
