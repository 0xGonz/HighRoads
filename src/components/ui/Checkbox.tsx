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
      <div className="flex items-start">
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn(
              'peer h-5 w-5 cursor-pointer appearance-none rounded border-2 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
              'checked:bg-accent checked:border-accent',
              error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400',
              className
            )}
            {...props}
          />
          <Check className="absolute h-3.5 w-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-[3px]" />
        </div>
        <label
          htmlFor={checkboxId}
          className={cn(
            'ml-3 cursor-pointer text-sm',
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
