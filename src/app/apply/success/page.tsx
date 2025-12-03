import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Application Submitted | High Road Technologies',
  description: 'Your application has been submitted successfully. Our team will be in touch soon.',
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-primary-700 mb-4">
            Application Submitted!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you for applying to the High Road lease-to-own program. We&apos;ve received your application and are excited to review it.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-primary-700 mb-4">What Happens Next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Review Period</p>
                  <p className="text-sm text-gray-600">
                    Our team will review your application within 24 hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">We&apos;ll Call You</p>
                  <p className="text-sm text-gray-600">
                    A team member will reach out to discuss next steps and answer any questions.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Check Your Email</p>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive a confirmation email with additional information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline">
                Return Home
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="secondary">
                View FAQ
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Questions? Call us at{' '}
            <a href="tel:+15551234567" className="text-accent hover:underline">
              (555) 123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
