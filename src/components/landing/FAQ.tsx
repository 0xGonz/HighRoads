'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FAQ_ITEMS } from '@/lib/config'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-800 mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Got questions? We&apos;ve got answers. If you don&apos;t see your question here, reach out to us.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => (
            <div
              key={index}
              className={cn(
                'group bg-white rounded-2xl shadow-soft overflow-hidden border-l-4 transition-all duration-300 ease-smooth',
                openIndex === index
                  ? 'border-accent-500 shadow-soft-lg'
                  : 'border-transparent hover:border-primary-200/50 hover:shadow-soft-lg'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
              >
                <span className="font-display font-semibold text-primary-800 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-primary-600 flex-shrink-0 transition-transform duration-300',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <p
                  className={cn(
                    'px-6 pb-5 text-gray-600 leading-relaxed transition-opacity duration-200',
                    openIndex === index ? 'opacity-100 delay-100' : 'opacity-0'
                  )}
                >
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
