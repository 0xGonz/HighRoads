import Link from 'next/link'
import { ArrowRight, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CTA() {
  return (
    <section className="py-24 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 rounded-2xl p-8 md:p-14 text-center text-white shadow-soft-xl">
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 mb-8 text-gray-200">
            <span className="flex items-center text-sm font-medium">
              <Clock className="h-4 w-4 mr-2" />
              5-Minute Application
            </span>
            <span className="flex items-center text-sm font-medium">
              <Shield className="h-4 w-4 mr-2" />
              No Credit Check
            </span>
          </div>

          <h2 className="font-display tracking-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            Own Your Truck in Minutes
          </h2>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Take the first step toward truck ownership today. Our simple application takes just 5 minutes, and we&apos;ll respond within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="text-lg group">
                Apply in 5 Minutes
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 ease-smooth group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="text-lg border-white text-white hover:bg-white hover:text-primary-700">
                Learn How It Works
              </Button>
            </Link>
          </div>

          <p className="mt-10 text-gray-200 text-base">
            Pre-approved in minutes. No obligations. Start your journey to ownership today.
          </p>
        </div>
      </div>
    </section>
  )
}
