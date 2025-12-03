'use client'

import { useState, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, XCircle, Lightbulb, Mail, Phone, RefreshCw } from 'lucide-react'
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

// Error messages for different API error codes
const ERROR_MESSAGES: Record<string, { title: string; message: string; showContact: boolean; showRetry: boolean }> = {
  SERVICE_NOT_CONFIGURED: {
    title: 'System Temporarily Unavailable',
    message: 'We are experiencing technical difficulties. Please try again later or contact us directly.',
    showContact: true,
    showRetry: false,
  },
  EXTERNAL_SERVICE_ERROR: {
    title: 'Processing Error',
    message: 'Unable to process your application right now. Please try again in a few minutes.',
    showContact: false,
    showRetry: true,
  },
  VALIDATION_ERROR: {
    title: 'Invalid Information',
    message: 'Please check your information and try again.',
    showContact: false,
    showRetry: false,
  },
  INTERNAL_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    showContact: false,
    showRetry: true,
  },
  DEFAULT: {
    title: 'Submission Error',
    message: 'There was an error submitting your application. Please try again.',
    showContact: true,
    showRetry: true,
  },
}

interface SubmitErrorState {
  code: string
  title: string
  message: string
  showContact: boolean
  showRetry: boolean
}

export function ApplicationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<SubmitErrorState | null>(null)
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

      // Parse response body
      const responseData = await response.json()

      if (!response.ok) {
        // Get error details from response
        const errorCode = responseData.error || 'DEFAULT'
        const errorConfig = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.DEFAULT

        setSubmitError({
          code: errorCode,
          title: errorConfig.title,
          message: responseData.message || errorConfig.message,
          showContact: errorConfig.showContact,
          showRetry: errorConfig.showRetry,
        })
        return
      }

      // Check if submission was actually successful
      if (!responseData.success) {
        setSubmitError({
          code: 'DEFAULT',
          ...ERROR_MESSAGES.DEFAULT,
        })
        return
      }

      // Set flag so success page knows this is a valid submission
      sessionStorage.setItem('applicationSubmitted', 'true')
      router.push('/apply/success')
    } catch (error) {
      console.error('Error submitting application:', error)
      // Network error or JSON parse error
      setSubmitError({
        code: 'NETWORK_ERROR',
        title: 'Connection Error',
        message: 'Unable to connect to our servers. Please check your internet connection and try again.',
        showContact: true,
        showRetry: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  // Show disqualification message with helpful guidance
  if (disqualified && !disqualified.qualified) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <Lightbulb className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-scale-bounce" />
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
            <Button variant="outline" onClick={() => setDisqualified(null)}>
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
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-5 animate-fade-in-down">
            <div className="flex items-start">
              <XCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0 animate-shake" />
              <div className="flex-1">
                <p className="text-red-800 font-semibold text-lg">{submitError.title}</p>
                <p className="text-red-600 mt-1">{submitError.message}</p>

                {/* Contact options */}
                {submitError.showContact && (
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <p className="text-sm text-red-700 mb-3">Contact us directly:</p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="mailto:contact@highroadtech.com"
                        className="inline-flex items-center text-sm bg-white border border-red-300 rounded-lg px-3 py-2 text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        contact@highroadtech.com
                      </a>
                      <a
                        href="tel:+18005551234"
                        className="inline-flex items-center text-sm bg-white border border-red-300 rounded-lg px-3 py-2 text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        (800) 555-1234
                      </a>
                    </div>
                  </div>
                )}

                {/* Retry button */}
                {submitError.showRetry && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitError(null)
                        handleSubmit(onSubmit)()
                      }}
                      className="inline-flex items-center text-sm bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="text-red-400 hover:text-red-600 ml-2"
                aria-label="Dismiss error"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          {/* Mobile step counter */}
          <p className="text-center text-sm text-gray-500 mb-4 sm:hidden animate-fade-in">
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
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white shadow-md shadow-green-500/30 scale-100'
                        : currentStep === step.id
                        ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-110'
                        : 'bg-gray-200 text-gray-500 scale-100'
                    }`}
                    aria-current={currentStep === step.id ? 'step' : undefined}
                  >
                    {/* Pulse ring for current step */}
                    {currentStep === step.id && (
                      <span className="absolute inset-0 rounded-full bg-accent/30 animate-pulse-ring" />
                    )}
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5 animate-scale-bounce" />
                    ) : (
                      <span className={currentStep === step.id ? 'animate-fade-in' : ''}>
                        {step.id}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs hidden sm:block transition-all duration-300 ${
                      currentStep > step.id
                        ? 'text-green-600 font-medium'
                        : currentStep === step.id
                        ? 'text-accent font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className="relative w-full h-1 mx-2 bg-gray-200 rounded-full overflow-hidden"
                    style={{ minWidth: '40px' }}
                  >
                    {/* Animated progress fill */}
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 ease-out ${
                        currentStep > step.id ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-shadow duration-300 hover:shadow-xl">
            {/* Step content with fade animation - key forces re-render on step change */}
            <div key={currentStep} className="animate-fade-in-up">
              <CurrentStepComponent />
            </div>

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
