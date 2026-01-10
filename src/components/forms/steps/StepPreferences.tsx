'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RadioGroup } from '@/components/ui/RadioGroup'
import {
  ApplicationFormData,
  OWNERSHIP_GOALS,
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
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Preferences
      </h2>
      <p className="text-gray-600 mb-6">
        Tell us about your ownership goals and preferences. With our 50/50 profit split, higher weekly earnings to HRC mean faster ownership.
      </p>

      <div className="space-y-6">
        <Select
          label="Ownership Goal"
          options={OWNERSHIP_GOALS}
          placeholder="Select your target timeline"
          error={errors.ownership_goal?.message}
          {...register('ownership_goal')}
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
