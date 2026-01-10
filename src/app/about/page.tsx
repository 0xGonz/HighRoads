import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, Heart, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/layout/PageHero'

export const metadata: Metadata = {
  title: 'About Us | High Road Capital LLC',
  description: 'Learn about High Road Capital LLC and our mission to help drivers own their own trucks through our innovative lease-to-own program.',
}

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower hardworking drivers to achieve truck ownership and financial independence through accessible, transparent financing.',
  },
  {
    icon: Heart,
    title: 'Driver-First',
    description: 'Every decision we make starts with one question: How does this help our drivers succeed? Your success is our success.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We\'re building more than a business—we\'re building a community of owner-operators who support and learn from each other.',
  },
  {
    icon: Award,
    title: 'Integrity',
    description: 'No hidden fees, no surprises. We believe in transparent terms and honest communication at every step.',
  },
]

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="About High Road Capital"
        subtitle="We started High Road with a simple belief: every hardworking driver deserves the opportunity to own their own truck, regardless of their credit history or available cash."
      />

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-700 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                High Road Capital LLC was founded by people who understand the trucking industry from the inside out. We&apos;ve seen firsthand how traditional financing fails hardworking drivers—requiring perfect credit, large down payments, and putting ownership out of reach.
              </p>
              <p className="mb-4">
                We knew there had to be a better way. A way that recognized a driver&apos;s commitment and work ethic, not just their credit score. A way that turned weekly payments into real equity, not just rent.
              </p>
              <p className="mb-4">
                That&apos;s why we created our lease-to-own program. We partner with top carriers to ensure our drivers have access to consistent, well-paying freight. We provide mentorship and support every step of the way. And we structure our payments so that every dollar brings you closer to ownership.
              </p>
              <p>
                Today, we&apos;re proud to have helped hundreds of drivers achieve their dream of truck ownership. But we&apos;re just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by these core principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <value.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the High Road Family?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Take the first step toward truck ownership today. Our team is here to help you every step of the way.
          </p>
          <Link href="/apply">
            <Button size="lg" className="text-lg">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
