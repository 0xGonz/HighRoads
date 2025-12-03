'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { ApplicationFormData } from '@/lib/validations'

export function StepContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplicationFormData>()

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-700 mb-2">
        Let&apos;s Get Started
      </h2>
      <p className="text-gray-600 mb-6">
        Tell us a bit about yourself so we can get in touch.
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
          helperText="We'll use this to contact you about your application"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>
    </div>
  )
}
