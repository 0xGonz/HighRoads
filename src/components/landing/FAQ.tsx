'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'What are the requirements to qualify?',
    answer: 'To qualify for our lease-to-own program, you need: a valid CDL (Class A), a current DOT medical card, at least 12 months of verifiable driving experience, eligibility to work in the United States, and a clean driving record. No credit check is required.',
  },
  {
    question: 'How much are the weekly payments?',
    answer: 'Weekly payments vary based on the truck you choose and your payment plan. Most drivers pay between $500-$800 per week. We work with you to find a payment that fits your budget and helps you build equity quickly.',
  },
  {
    question: 'Do I need to put money down?',
    answer: 'No! Our program is designed to be accessible. You can start with $0 down. Some drivers choose to make a down payment to reduce their weekly payments, but it\'s completely optional.',
  },
  {
    question: 'What carriers can I drive for?',
    answer: 'We have partnerships with top-paying carriers across the country. During your application process, we\'ll match you with carriers that fit your preferred freight type, routes, and schedule. If you already have a carrier in mind, let us know.',
  },
  {
    question: 'How long until I own the truck?',
    answer: 'Most drivers complete their lease-to-own agreement in 3-5 years, depending on the payment plan chosen. Every payment you make builds equity toward ownership.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We provide comprehensive support including: 24/7 roadside assistance, business training and mentorship, help with LLC formation and tax preparation, rate negotiation guidance, and a community of fellow drivers.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Got questions? We&apos;ve got answers. If you don&apos;t see your question here, reach out to us.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-primary-700 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-accent flex-shrink-0 transition-transform',
                    openIndex === index && 'transform rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
