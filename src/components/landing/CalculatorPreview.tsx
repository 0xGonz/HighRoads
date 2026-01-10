import Link from 'next/link'
import { Calculator, TrendingUp, DollarSign, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PROGRAM } from '@/lib/config'

export function CalculatorPreview() {
  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Text */}
          <div>
            <div className="inline-flex items-center bg-primary-100 rounded-full px-4 py-2 mb-6">
              <Calculator className="h-5 w-5 text-primary-700 mr-2" />
              <span className="text-sm font-medium text-primary-700">Ownership Calculator</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              See Your Path to Ownership
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              Use our interactive calculator to see when you&apos;ll own your truck based on your performance and carrier earnings.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Performance-Based Ownership</p>
                  <p className="text-sm text-gray-500">High performers can own in as little as 1 year</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{PROGRAM.profitSplit}/{PROGRAM.profitSplit} Profit Split</p>
                  <p className="text-sm text-gray-500">Your earnings build equity toward ownership</p>
                </div>
              </div>
            </div>

            <Link href="/calculator">
              <Button size="lg" className="group">
                Try the Calculator
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Right side - Preview Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">Ownership Timeline</p>
              <p className="text-4xl font-bold text-primary-700">1 - 3 years</p>
              <p className="text-gray-600">depending on performance</p>
            </div>

            {/* Ownership tiers */}
            <div className="space-y-3 mb-6">
              {PROGRAM.ownershipTimeline.slice(0, 3).map((tier) => (
                <div key={tier.hrcWeeklyEarnings} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium text-gray-700">
                    ${tier.hrcWeeklyEarnings.toLocaleString()}/week to HRC
                  </span>
                  <span className="text-sm font-bold text-primary-700">
                    {tier.yearsToOwnership} {tier.yearsToOwnership === 1 ? 'year' : 'years'}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{PROGRAM.truckModels.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">Peterbilt 579</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">$0</p>
                <p className="text-xs text-gray-500">Down Payment</p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/calculator" className="text-primary-700 hover:underline text-sm font-medium">
                Customize your numbers →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
