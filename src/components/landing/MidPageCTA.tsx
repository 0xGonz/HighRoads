import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface MidPageCTAProps {
  title?: string
  subtitle?: string
}

export function MidPageCTA({
  title = "Ready to Earn Your Truck?",
  subtitle = "Check your eligibility in under 5 minutes. No credit check required."
}: MidPageCTAProps) {
  return (
    <section className="py-10 bg-gradient-to-r from-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
              {title}
            </h3>
            <p className="text-gray-300">
              {subtitle}
            </p>
          </div>
          <Link href="/apply">
            <Button size="lg" className="whitespace-nowrap group">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
