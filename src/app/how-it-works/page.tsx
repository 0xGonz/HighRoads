import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  ClipboardCheck,
  UserCheck,
  Truck,
  Building2,
  Key,
  TrendingUp,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/layout/PageHero'

export const metadata: Metadata = {
  title: 'How It Works | High Road Partners LLC',
  description: 'Learn how our lease-to-own trucking program works. From application to ownership, we guide you every step of the way.',
}

const steps = [
  {
    number: 1,
    icon: ClipboardCheck,
    title: 'Submit Your Application',
    description: 'Complete our simple online application in just a few minutes. We\'ll ask about your driving experience, CDL status, and preferences.',
    details: [
      'No credit check required',
      'Takes only 5 minutes',
      'Immediate pre-qualification decision',
    ],
  },
  {
    number: 2,
    icon: UserCheck,
    title: 'Get Pre-Approved',
    description: 'Our team reviews your application within 24 hours. If you meet our requirements, you\'ll be pre-approved to move forward.',
    details: [
      'Quick 24-hour review',
      'Personal call from our team',
      'Clear explanation of next steps',
    ],
  },
  {
    number: 3,
    icon: Building2,
    title: 'Carrier Matching',
    description: 'We\'ll match you with one of our partner carriers based on your preferences for freight type, routes, and schedule.',
    details: [
      'Top-paying carrier partners',
      'Consistent freight availability',
      'Flexible schedule options',
    ],
  },
  {
    number: 4,
    icon: Truck,
    title: 'Choose Your Truck',
    description: 'Browse our inventory of quality trucks and select the one that fits your needs and budget. Schedule a time to see it in person.',
    details: [
      'Wide selection of trucks',
      'Flexible payment options',
      'In-person viewing available',
    ],
  },
  {
    number: 5,
    icon: Key,
    title: 'Start Driving',
    description: 'Complete your orientation, get your truck, and hit the road. Our support team is available 24/7 to help you succeed.',
    details: [
      'Comprehensive onboarding',
      '24/7 support available',
      'Mentorship program',
    ],
  },
  {
    number: 6,
    icon: TrendingUp,
    title: 'Build Equity',
    description: 'Every weekly payment builds equity toward ownership. Most drivers complete their lease-to-own agreement in 3-5 years.',
    details: [
      'Every payment builds equity',
      'Track progress in your portal',
      'Admin fee reduces each year',
    ],
  },
]

const requirements = [
  'Valid CDL (Class A)',
  'Current DOT medical card',
  'At least 12 months of verifiable driving experience',
  'Eligible to work in the United States',
  'Clean driving record (MVR check)',
  'No DUI/DWI in the past 5 years',
]

export default function HowItWorksPage() {
  return (
    <div>
      <PageHero
        title="How Our Program Works"
        subtitle="From application to ownership, we've designed every step to be simple, transparent, and focused on your success."
      />

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <span className="text-5xl font-bold text-accent/20 mr-4">
                      {String(step.number).padStart(2, '0')}
                    </span>
                    <step.icon className="h-10 w-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-700 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center text-gray-600">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-gray-100 rounded-xl p-8 aspect-video flex items-center justify-center">
                    <step.icon className="h-24 w-24 text-primary-700/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-700 mb-6 text-center">
              Program Requirements
            </h2>
            <p className="text-gray-600 text-lg text-center mb-10">
              To qualify for our lease-to-own program, you&apos;ll need to meet these basic requirements:
            </p>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requirements.map((req) => (
                  <li key={req} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-gray-500 text-center">
                Don&apos;t meet all the requirements? Contact us anyway—we may be able to work with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            The road to truck ownership starts with a simple application. No credit check, no commitment.
          </p>
          <Link href="/apply">
            <Button variant="secondary" size="lg" className="text-lg">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
