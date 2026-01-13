'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Phone, Mail, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { COMPANY } from '@/lib/config'
import { SuccessCheckmarkFilled } from '@/components/ui/SuccessCheckmark'

function SuccessContent() {
  const [isValidAccess, setIsValidAccess] = useState<boolean | null>(null)
  const [showContent, setShowContent] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check URL param first (more reliable), then sessionStorage
    const urlSubmitted = searchParams.get('submitted') === 'true'
    const sessionSubmitted = typeof window !== 'undefined' && sessionStorage.getItem('applicationSubmitted') === 'true'

    if (urlSubmitted || sessionSubmitted) {
      setIsValidAccess(true)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('applicationSubmitted')
      }
    } else {
      setIsValidAccess(false)
    }
  }, [searchParams])

  // Loading state
  if (isValidAccess === null) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6" />
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    )
  }

  // Direct access without form submission
  if (!isValidAccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
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
    )
  }

  // Valid access - show success with animation
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 overflow-hidden">
      {/* Animated Checkmark */}
      <div className="flex justify-center mb-6">
        <SuccessCheckmarkFilled
          size={80}
          onAnimationComplete={() => setShowContent(true)}
        />
      </div>

      {/* Content that fades in after checkmark animation */}
      <div
        className={`transition-all duration-500 ${
          showContent
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Application Received!
          </h1>
          <p className="text-gray-600">
            We&apos;ve received your application and will review it within one business day.
          </p>
        </div>

        {/* What happens next - with staggered animations */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">What Happens Next</h2>
          <div className="space-y-4">
            <div
              className={`flex items-start transition-all duration-500 delay-100 ${
                showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Review Period</p>
                <p className="text-sm text-gray-600">
                  Our team will review your application within 24 hours.
                </p>
              </div>
            </div>

            <div
              className={`flex items-start transition-all duration-500 delay-200 ${
                showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone Call</p>
                <p className="text-sm text-gray-600">
                  A team member will call you to discuss next steps.
                </p>
              </div>
            </div>

            <div
              className={`flex items-start transition-all duration-500 delay-300 ${
                showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
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
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 delay-400 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link href="/status">
            <Button variant="outline">Check Status</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Return Home</Button>
          </Link>
        </div>

        <p
          className={`mt-8 text-sm text-gray-500 text-center transition-all duration-500 delay-500 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Questions? Email{' '}
          <a href={`mailto:${COMPANY.supportEmail}`} className="text-accent hover:underline">
            {COMPANY.supportEmail}
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </div>
          }>
            <SuccessContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
