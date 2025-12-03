'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { ApplicationFormData, US_STATES } from '@/lib/validations'

export function StepQualification() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-700 mb-2">
        Pre-Qualification
      </h2>
      <p className="text-gray-600 mb-6">
        Let&apos;s make sure you meet our basic requirements.
      </p>

      <div className="space-y-6">
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Please confirm the following:
          </p>

          <Controller
            name="has_cdl"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="I have a valid CDL (Class A)"
                checked={field.value}
                onChange={field.onChange}
                error={errors.has_cdl?.message}
              />
            )}
          />

          <Controller
            name="has_medical_card"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="I have a current DOT medical card"
                checked={field.value}
                onChange={field.onChange}
                error={errors.has_medical_card?.message}
              />
            )}
          />

          <Controller
            name="us_work_eligible"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="I am eligible to work in the United States"
                checked={field.value}
                onChange={field.onChange}
                error={errors.us_work_eligible?.message}
              />
            )}
          />
        </div>

        <Controller
          name="experience_months"
          control={control}
          render={({ field }) => (
            <Input
              label="Months of Driving Experience"
              type="number"
              min="0"
              placeholder="24"
              helperText="Minimum 12 months required"
              error={errors.experience_months?.message}
              value={field.value || ''}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          )}
        />

        <Select
          label="State of Residence"
          options={US_STATES}
          placeholder="Select your state"
          error={errors.location_state?.message}
          {...register('location_state')}
        />
      </div>
    </div>
  )
}
