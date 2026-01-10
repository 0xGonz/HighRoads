import { Metadata } from 'next'
import { StatusLookup } from '@/components/status/StatusLookup'

export const metadata: Metadata = {
  title: 'Check Application Status | High Road Capital LLC',
  description: 'Check the status of your lease-to-own truck application.',
}

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Check Your Application Status
          </h1>
          <p className="text-lg text-gray-600">
            Enter your email and phone to see where your application stands.
          </p>
        </div>

        <StatusLookup />

        <p className="text-center text-sm text-gray-500 mt-8">
          Can&apos;t find your application? Contact us at{' '}
          <a href="mailto:support@highroadcapitalllc.com" className="text-accent hover:underline">
            support@highroadcapitalllc.com
          </a>
        </p>
        </div>
      </div>
    </div>
  )
}
