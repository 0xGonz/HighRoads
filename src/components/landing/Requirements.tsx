import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const requirements = [
  { text: 'Valid CDL-A license', required: true },
  { text: '12+ months OTR experience', required: true },
  { text: 'Clean MVR (no major violations)', required: true },
  { text: 'Must be 23 years or older', required: true },
  { text: 'Authorized to work in the US', required: true },
]

const notRequired = [
  { text: 'No credit check required', required: false },
  { text: 'No large down payment', required: false },
  { text: 'No truck ownership experience needed', required: false },
]

export function Requirements() {
  return (
    <section className="py-12 lg:py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-3">
              Program Requirements
            </h2>
            <p className="text-gray-600">
              Here&apos;s what you need to qualify for our lease-to-own program.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Required */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-primary-800 mb-4">What You Need</h3>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req.text} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{req.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Required */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-primary-800 mb-4">What You Don&apos;t Need</h3>
              <ul className="space-y-3">
                {notRequired.map((req) => (
                  <li key={req.text} className="flex items-start space-x-2">
                    <XCircle className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{req.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link href="/apply">
              <Button size="lg" className="px-8 group">
                Check Your Eligibility
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              Takes less than 5 minutes. No commitment required.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
