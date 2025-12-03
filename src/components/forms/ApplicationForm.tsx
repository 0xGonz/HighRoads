'use client'

import { useState, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, XCircle, Lightbulb } from 'lucide-react'
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
  const [submitError, setSubmitError] = useState<string | null>(null)
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
    setSubmitError(null)

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
      setSubmitError('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  // Show disqualification message with helpful guidance
  if (disqualified && !disqualified.qualified) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
          <div className="text-center mb-6">
            <Lightbulb className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Let&apos;s Get You Ready
            </h2>
            <p className="text-gray-600">
              You&apos;re not quite there yet, but here&apos;s what you need:
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Requirements to meet:</h3>
            <ul className="space-y-3">
              {disqualified.reasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-800">
              <strong>Need help?</strong> Many drivers get their CDL or medical card within weeks.
              When your situation changes, come back and apply — we&apos;d love to help you own your truck!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={handleBack}>
              Go Back & Edit
            </Button>
            <Button onClick={() => router.push('/')}>
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
        {/* Error notification */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Submission Error</p>
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          {/* Mobile step counter */}
          <p className="text-center text-sm text-gray-500 mb-4 sm:hidden">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
          </p>

          <div
            className="flex items-center justify-between"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-label="Application progress"
          >
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-accent text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    aria-current={currentStep === step.id ? 'step' : undefined}
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
                    className={`w-full h-1 mx-2 transition-colors ${
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
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <CurrentStepComponent />

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
