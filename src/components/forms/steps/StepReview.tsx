'use client'

import { useFormContext } from 'react-hook-form'
import { CheckCircle } from 'lucide-react'
import {
  ApplicationFormData,
  US_STATES,
  PAYMENT_RANGES,
  TRUCK_PREFERENCES,
  FREIGHT_PREFERENCES,
} from '@/lib/validations'

function getLabelFromValue(options: { value: string; label: string }[], value: string) {
  return options.find((opt) => opt.value === value)?.label || value
}

export function StepReview() {
  const { getValues } = useFormContext<ApplicationFormData>()
  const values = getValues()

  const sections = [
    {
      title: 'Contact Information',
      items: [
        { label: 'Name', value: `${values.first_name} ${values.last_name}` },
        { label: 'Email', value: values.email },
        { label: 'Phone', value: values.phone },
      ],
    },
    {
      title: 'Qualifications',
      items: [
        { label: 'CDL Status', value: values.has_cdl ? 'Valid CDL' : 'No CDL' },
        { label: 'Medical Card', value: values.has_medical_card ? 'Current' : 'Not Current' },
        { label: 'Experience', value: `${values.experience_months} months` },
        { label: 'State', value: getLabelFromValue(US_STATES, values.location_state) },
        { label: 'US Work Eligible', value: values.us_work_eligible ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Weekly Budget', value: getLabelFromValue(PAYMENT_RANGES, values.weekly_payment_budget) },
        { label: 'Truck Type', value: getLabelFromValue(TRUCK_PREFERENCES, values.truck_preference) },
        { label: 'Freight Type', value: getLabelFromValue(FREIGHT_PREFERENCES, values.freight_preference) },
        { label: 'Existing Carrier', value: values.has_existing_carrier ? values.carrier_name || 'Yes' : 'No - Help me find one' },
      ],
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-700 mb-2">
        Review Your Application
      </h2>
      <p className="text-gray-600 mb-6">
        Please review your information before submitting.
      </p>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-primary-700 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              {section.title}
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {section.items.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-primary-700">
            <strong>What happens next?</strong> After you submit, our team will review your application and contact you within 24 hours. If you&apos;re pre-approved, you&apos;ll get access to browse our truck inventory and schedule a viewing.
          </p>
        </div>
      </div>
    </div>
  )
}
