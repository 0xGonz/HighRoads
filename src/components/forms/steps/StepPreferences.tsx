'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RadioGroup } from '@/components/ui/RadioGroup'
import {
  ApplicationFormData,
  PAYMENT_RANGES,
  TRUCK_PREFERENCES,
  FREIGHT_PREFERENCES,
} from '@/lib/validations'

export function StepPreferences() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  const hasExistingCarrier = watch('has_existing_carrier')

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-700 mb-2">
        Your Preferences
      </h2>
      <p className="text-gray-600 mb-6">
        Help us find the best match for you.
      </p>

      <div className="space-y-6">
        <Select
          label="Weekly Payment Budget"
          options={PAYMENT_RANGES}
          placeholder="Select a payment range"
          error={errors.weekly_payment_budget?.message}
          {...register('weekly_payment_budget')}
        />

        <Select
          label="Truck Preference"
          options={TRUCK_PREFERENCES}
          placeholder="Select truck type"
          error={errors.truck_preference?.message}
          {...register('truck_preference')}
        />

        <Select
          label="Freight Preference"
          options={FREIGHT_PREFERENCES}
          placeholder="Select freight type"
          error={errors.freight_preference?.message}
          {...register('freight_preference')}
        />

        <Controller
          name="has_existing_carrier"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Do you already have a carrier you want to drive for?"
              options={[
                { value: 'true', label: 'Yes', description: 'I have a carrier in mind' },
                { value: 'false', label: 'No', description: 'Help me find a carrier' },
              ]}
              value={String(field.value)}
              onChange={(e) => field.onChange(e.target.value === 'true')}
              error={errors.has_existing_carrier?.message}
            />
          )}
        />

        {hasExistingCarrier && (
          <Input
            label="Carrier Name"
            placeholder="Enter carrier name"
            error={errors.carrier_name?.message}
            {...register('carrier_name')}
          />
        )}
      </div>
    </div>
  )
}
