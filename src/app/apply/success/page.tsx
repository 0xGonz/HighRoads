'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { COMPANY } from '@/lib/config'

export default function SuccessPage() {
  const [isValidAccess, setIsValidAccess] = useState<boolean | null>(null)

  useEffect(() => {
    const submittedFlag = sessionStorage.getItem('applicationSubmitted')

    if (submittedFlag === 'true') {
      setIsValidAccess(true)
      sessionStorage.removeItem('applicationSubmitted')
    } else {
      setIsValidAccess(false)
    }
  }, [])

  // Loading state
  if (isValidAccess === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-soft p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Direct access without form submission
  if (!isValidAccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-soft p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-4">
                No Application Found
              </h1>

              <p className="text-gray-600 mb-8">
                It looks like you haven&apos;t submitted an application yet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apply">
                  <Button>Start Application</Button>
                </Link>
                <Link href="/status">
                  <Button variant="outline">Check Existing Application</Button>
                </Link>
              </div>

              <p className="mt-8 text-sm text-gray-500">
                Already submitted?{' '}
                <a href={`mailto:${COMPANY.supportEmail}`} className="text-accent hover:underline">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Valid access - show success
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-soft p-8">
          {/* Simple checkmark */}
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Application Received
            </h1>
            <p className="text-gray-600">
              We&apos;ve received your application and will review it within one business day.
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">What Happens Next</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Review Period</p>
                  <p className="text-sm text-gray-600">
                    Our team will review your application within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Phone Call</p>
                  <p className="text-sm text-gray-600">
                    A team member will call you to discuss next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Email Confirmation</p>
                  <p className="text-sm text-gray-600">
                    Check your email for a confirmation with additional information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/status">
              <Button variant="outline">Check Status</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Return Home</Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500 text-center">
            Questions? Email{' '}
            <a href={`mailto:${COMPANY.supportEmail}`} className="text-accent hover:underline">
              {COMPANY.supportEmail}
            </a>
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}
