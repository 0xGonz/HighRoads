import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FAQ } from '@/components/landing/FAQ'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'FAQ | High Road Technologies',
  description: 'Find answers to frequently asked questions about our lease-to-own trucking program, requirements, payments, and more.',
}

export default function FAQPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Find answers to common questions about our lease-to-own program.
          </p>
        </div>
      </section>

      {/* FAQ Component */}
      <FAQ />

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15551234567"
              className="inline-flex items-center justify-center bg-primary-700 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Call (555) 123-4567
            </a>
            <a
              href="mailto:info@highroad.com"
              className="inline-flex items-center justify-center border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-primary-700 mb-4">
            Ready to Take the Next Step?
          </h2>
          <Link href="/apply">
            <Button size="lg">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
