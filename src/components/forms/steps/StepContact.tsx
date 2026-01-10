'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Select } from '@/components/ui/Select'
import { ApplicationFormData, LEAD_SOURCES } from '@/lib/validations'

export function StepContact() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  const leadSource = useWatch({ control, name: 'lead_source' })
  const showReferralCode = leadSource === 'friend' || leadSource === 'driver'

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Contact Information
      </h2>
      <p className="text-gray-600 mb-6">
        We&apos;ll use this to follow up on your application.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="john.doe@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          error={errors.phone?.message}
          {...register('phone')}
        />

        {/* SMS Opt-in */}
        <div className="pt-2 pb-1">
          <Checkbox
            label="I agree to receive text message updates about my application"
            {...register('sms_opt_in')}
          />
          <p className="text-xs text-gray-500 ml-9 mt-1">
            Message & data rates may apply. Reply STOP to unsubscribe.
          </p>
        </div>

        {/* Lead Source */}
        <Select
          label="How did you hear about us?"
          placeholder="Select an option"
          options={LEAD_SOURCES}
          error={errors.lead_source?.message}
          {...register('lead_source')}
        />

        {/* Referral Code - shown only for referral sources */}
        {showReferralCode && (
          <Input
            label="Referral Code (optional)"
            placeholder="Enter referral code if you have one"
            error={errors.referral_code?.message}
            {...register('referral_code')}
          />
        )}
      </div>
    </div>
  )
}
