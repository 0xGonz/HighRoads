import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-8 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Own Your Future?
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Take the first step toward truck ownership today. Our simple application takes just a few minutes, and we&apos;ll be in touch within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center justify-center border-2 border-white hover:bg-white hover:text-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Us Now
            </a>
          </div>

          <p className="mt-8 text-gray-300 text-sm">
            No credit check required. Get pre-approved in minutes.
          </p>
        </div>
      </div>
    </section>
  )
}
