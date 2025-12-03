import Link from 'next/link'
import { ArrowRight, Clock, Shield } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-8 md:p-16 text-center text-white">
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mb-6 text-gray-200">
            <span className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1" />
              5-Minute Application
            </span>
            <span className="flex items-center text-sm">
              <Shield className="h-4 w-4 mr-1" />
              No Credit Check
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Own Your Truck in Minutes
          </h2>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto mb-8">
            Take the first step toward truck ownership today. Our simple application takes just 5 minutes, and we&apos;ll respond within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
            >
              Apply in 5 Minutes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center border-2 border-white hover:bg-white hover:text-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Learn How It Works
            </Link>
          </div>

          <p className="mt-8 text-gray-100 text-base">
            Pre-approved in minutes. No obligations. Start your journey to ownership today.
          </p>
        </div>
      </div>
    </section>
  )
}
