'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Search, CheckCircle, Clock, FileText, Truck, AlertCircle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const statusSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone_last4: z.string().length(4, 'Please enter exactly 4 digits').regex(/^\d{4}$/, 'Must be 4 digits'),
})

type StatusFormData = z.infer<typeof statusSchema>

interface StatusResult {
  firstName: string
  status: string
  description: string
  step: number
  isPrequalified?: boolean
}

const STEPS = [
  { id: 1, label: 'Received', icon: FileText },
  { id: 2, label: 'Review', icon: Search },
  { id: 3, label: 'Processing', icon: Clock },
  { id: 4, label: 'Approved', icon: CheckCircle },
  { id: 5, label: 'Active', icon: Truck },
]

export function StatusLookup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StatusResult | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
  })

  const onSubmit = async (data: StatusFormData) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        setError(responseData.message || 'Unable to find your application')
        return
      }

      setResult(responseData.data)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (result) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-6 sm:p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Hi {result.firstName}!
          </h2>
          <p className="text-gray-600 mt-1">Here&apos;s your application status</p>
        </div>

        {/* Status Badge */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-primary-600 font-medium">Current Status</p>
          <p className="text-2xl font-bold text-primary-700 mt-1">{result.status}</p>
          <p className="text-gray-600 mt-2">{result.description}</p>
        </div>

        {/* Progress Steps */}
        {result.step > 0 && (
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 mb-4">Application Progress</p>
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = result.step >= step.id
                const isCurrent = result.step === step.id

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-accent text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 hidden sm:block ${
                          isCompleted || isCurrent ? 'text-gray-900 font-medium' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-8 sm:w-12 h-1 mx-1 rounded ${
                          result.step > step.id ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Pre-qualification status */}
        {result.isPrequalified !== undefined && (
          <div
            className={`rounded-lg p-4 mb-6 ${
              result.isPrequalified
                ? 'bg-green-50 border border-green-200'
                : 'bg-amber-50 border border-amber-200'
            }`}
          >
            <div className="flex items-center">
              {result.isPrequalified ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Pre-Qualified</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-amber-800 font-medium">Additional Review Required</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setResult(null)}
          >
            Check Another
          </Button>
          <Button
            className="flex-1"
            onClick={() => window.location.href = 'mailto:support@highroadcapitalllc.com'}
          >
            Contact Support
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="john.doe@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Last 4 Digits of Phone"
          type="text"
          maxLength={4}
          placeholder="1234"
          helperText="Enter the last 4 digits of the phone number you used to apply"
          error={errors.phone_last4?.message}
          {...register('phone_last4')}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Looking up...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Check Status
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
