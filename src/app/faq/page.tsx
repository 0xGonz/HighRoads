import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { FAQ } from '@/components/landing/FAQ'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/layout/PageHero'

export const metadata: Metadata = {
  title: 'FAQ | High Road Partners LLC',
  description: 'Find answers to frequently asked questions about our lease-to-own trucking program, requirements, payments, and more.',
}

export default function FAQPage() {
  return (
    <div>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our lease-to-own program."
      />

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
          <a href="mailto:contact@highroadtech.com">
            <Button variant="outline" size="lg">
              <Mail className="mr-2 h-5 w-5" />
              Email Us
            </Button>
          </a>
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
