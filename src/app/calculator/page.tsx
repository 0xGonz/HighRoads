import { Metadata } from 'next'
import { OwnershipCalculator } from '@/components/calculator/OwnershipCalculator'

export const metadata: Metadata = {
  title: 'Ownership Calculator | High Road Capital LLC',
  description: 'See your path to truck ownership. Calculate your payment timeline, equity buildup, and ownership date.',
}

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Your Path to Ownership
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See exactly how our lease-to-own program works. Adjust the sliders below to see your personalized timeline to truck ownership.
          </p>
        </div>

        <OwnershipCalculator />
        </div>
      </div>
    </div>
  )
}
