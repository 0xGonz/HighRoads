'use client'

import { useState, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StepContact } from './steps/StepContact'
import { StepQualification } from './steps/StepQualification'
import { StepPreferences } from './steps/StepPreferences'
import { StepReview } from './steps/StepReview'
import {
  applicationSchema,
  ApplicationFormData,
  checkPrequalification,
} from '@/lib/validations'

const STEPS = [
  { id: 1, title: 'Contact Info', component: StepContact },
  { id: 2, title: 'Qualification', component: StepQualification },
  { id: 3, title: 'Preferences', component: StepPreferences },
  { id: 4, title: 'Review', component: StepReview },
]

export function ApplicationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [disqualified, setDisqualified] = useState<{ qualified: boolean; reasons: string[] } | null>(null)
  const contactIdRef = useRef<string | null>(null) // Track GHL contact ID for updates

  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      has_cdl: false,
      has_medical_card: false,
      experience_months: 0,
      location_state: '',
      us_work_eligible: false,
      weekly_payment_budget: '',
      truck_preference: '',
      freight_preference: '',
      has_existing_carrier: false,
      carrier_name: '',
    },
  })

  const { handleSubmit, trigger, getValues } = methods

  // Track partial submissions to GHL for abandoned form recovery
  const trackPartialSubmission = async (step: number) => {
    const values = getValues()

    // Only track if we have contact info
    if (!values.first_name || !values.email || !values.phone) return

    try {
      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partial: true,
          step,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          contactId: contactIdRef.current,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.contact_id) {
          contactIdRef.current = data.contact_id
        }
      }
    } catch (error) {
      // Silently fail - don't interrupt user experience for tracking
      console.error('Error tracking partial submission:', error)
    }
  }

  const handleNext = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['first_name', 'last_name', 'email', 'phone']
        break
      case 2:
        fieldsToValidate = ['has_cdl', 'has_medical_card', 'experience_months', 'location_state', 'us_work_eligible']
        break
      case 3:
        fieldsToValidate = ['weekly_payment_budget', 'truck_preference', 'freight_preference', 'has_existing_carrier']
        break
    }

    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      // Track partial submission after completing each step (for abandoned form recovery)
      // This runs in the background - doesn't block the user
      trackPartialSubmission(currentStep)

      // Check pre-qualification after step 2
      if (currentStep === 2) {
        const values = getValues()
        const result = checkPrequalification({
          has_cdl: values.has_cdl,
          has_medical_card: values.has_medical_card,
          experience_months: values.experience_months,
          location_state: values.location_state,
          us_work_eligible: values.us_work_eligible,
        })

        if (!result.qualified) {
          setDisqualified(result)
          return
        }
      }

      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const handleBack = () => {
    setDisqualified(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          contactId: contactIdRef.current, // Pass existing contact ID to update rather than create
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      router.push('/apply/success')
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  // Show disqualification message
  if (disqualified && !disqualified.qualified) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            We&apos;re Unable to Pre-Approve Your Application
          </h2>
          <p className="text-gray-600 mb-6">
            Based on your responses, you don&apos;t currently meet our program requirements:
          </p>
          <ul className="text-left max-w-md mx-auto mb-8 space-y-2">
            {disqualified.reasons.map((reason, index) => (
              <li key={index} className="flex items-start text-red-600">
                <span className="mr-2">•</span>
                {reason}
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mb-6">
            If your situation changes, we&apos;d love to hear from you again. In the meantime, feel free to contact us with any questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={handleBack}>
              Go Back & Edit
            </Button>
            <Button variant="secondary" onClick={() => router.push('/')}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-accent text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs hidden sm:block ${
                      currentStep >= step.id ? 'text-primary-700' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ minWidth: '40px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <CurrentStepComponent />

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting}>
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
