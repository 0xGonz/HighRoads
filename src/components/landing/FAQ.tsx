'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FAQ_ITEMS } from '@/lib/config'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Split FAQs into two columns
  const midpoint = Math.ceil(FAQ_ITEMS.length / 2)
  const leftColumn = FAQ_ITEMS.slice(0, midpoint)
  const rightColumn = FAQ_ITEMS.slice(midpoint)

  const FAQItem = ({ faq, index }: { faq: typeof FAQ_ITEMS[0]; index: number }) => (
    <div
      className={cn(
        'bg-white rounded-lg border overflow-hidden',
        openIndex === index
          ? 'border-primary-600'
          : 'border-gray-200'
      )}
    >
      <button
        onClick={() => setOpenIndex(openIndex === index ? null : index)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
      >
        <span className="font-semibold text-primary-800 pr-3 text-sm">
          {faq.question}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-500 flex-shrink-0 transition-transform duration-200',
            openIndex === index && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          openIndex === index ? 'max-h-96' : 'max-h-0'
        )}
      >
        <p className="px-4 pb-3 text-gray-600 leading-relaxed text-sm border-t border-gray-100">
          {faq.answer}
        </p>
      </div>
    </div>
  )

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Got questions? We&apos;ve got answers. If you don&apos;t see your question here, reach out to us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumn.map((faq, idx) => (
              <FAQItem key={idx} faq={faq} index={idx} />
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightColumn.map((faq, idx) => (
              <FAQItem key={idx + midpoint} faq={faq} index={idx + midpoint} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
