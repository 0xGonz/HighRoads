'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Clean, professional animated checkmark
function AnimatedCheckmark() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-8">
      {/* Main circle - grows in */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-green-600 animate-circle-grow shadow-lg shadow-green-500/25" />

      {/* Checkmark SVG - draws in after circle */}
      <svg
        className="absolute inset-0 w-full h-full p-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M5 12l5 5L20 7"
          className="animate-checkmark-draw"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
          }}
        />
      </svg>
    </div>
  )
}

export default function SuccessPage() {
  const [isValidAccess, setIsValidAccess] = useState<boolean | null>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const submittedFlag = sessionStorage.getItem('applicationSubmitted')

    if (submittedFlag === 'true') {
      setIsValidAccess(true)
      sessionStorage.removeItem('applicationSubmitted')
      // Quick delay for content to appear after checkmark
      setTimeout(() => setShowContent(true), 300)
    } else {
      setIsValidAccess(false)
    }
  }, [])

  // Loading state
  if (isValidAccess === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Direct access without form submission
  if (!isValidAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-bounce">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No Application Found
            </h1>

            <p className="text-gray-600 mb-8">
              It looks like you haven&apos;t submitted an application yet, or you&apos;re viewing this page directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button>Start Your Application</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Return Home</Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-gray-500">
              Already submitted an application?{' '}
              <a href="mailto:contact@highroadtech.com" className="text-accent hover:underline">
                Contact us
              </a>
              {' '}if you have questions about your application status.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Valid access - show success (clean, professional)
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Animated checkmark - the main celebration */}
          <AnimatedCheckmark />

          {/* Content fades in together after checkmark */}
          <div
            className={`transition-opacity duration-400 ${
              showContent ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
              Application Submitted!
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Thank you for applying to the High Road lease-to-own program. We&apos;ve received your application and are excited to review it.
            </p>

            {/* What happens next section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="font-semibold text-primary-700 mb-4 text-lg">What Happens Next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Review Period</p>
                    <p className="text-sm text-gray-600">
                      Our team will review your application within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">We&apos;ll Call You</p>
                    <p className="text-sm text-gray-600">
                      A team member will reach out to discuss next steps and answer any questions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Check Your Email</p>
                    <p className="text-sm text-gray-600">
                      You&apos;ll receive a confirmation email with additional information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Return Home</Button>
              </Link>
              <Link href="/faq">
                <Button variant="secondary">View FAQ</Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-gray-500">
              Questions? Email us at{' '}
              <a href="mailto:contact@highroadtech.com" className="text-accent hover:underline">
                contact@highroadtech.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
