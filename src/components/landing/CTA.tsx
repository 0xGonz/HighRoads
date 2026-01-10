import Link from 'next/link'
import { ArrowRight, Phone, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { COMPANY, PROGRAM } from '@/lib/config'

export function CTA() {
  return (
    <section className="py-12 lg:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-800 rounded-lg p-8 md:p-10 text-white">

          <div className="relative">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - CTA */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Ready to Earn Your Truck?
                </h2>
                <p className="text-gray-300 mb-5">
                  Check your eligibility today. No credit check required. We&apos;ll review your application and get back to you within 24 hours.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link href="/apply">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6">
                      Apply Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 bg-white text-primary-800 border-white hover:bg-gray-100">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right side - Contact Info */}
              <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                <h3 className="font-bold mb-4">Have Questions? Let&apos;s Talk</h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-200" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{COMPANY.leader}</p>
                      <p className="text-xs text-gray-300">{COMPANY.leaderTitle}</p>
                    </div>
                  </div>

                  {COMPANY.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                        <Phone className="h-4 w-4 text-primary-200" />
                      </div>
                      <div>
                        <a href={`tel:${COMPANY.phone}`} className="font-semibold text-sm hover:text-white transition-colors">
                          {COMPANY.phone}
                        </a>
                        <p className="text-xs text-gray-300">Mon-Fri, 8am-6pm ET</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary-200" />
                    </div>
                    <div>
                      <a href={`mailto:${COMPANY.email}`} className="font-semibold text-sm hover:text-white transition-colors">
                        {COMPANY.email}
                      </a>
                      <p className="text-xs text-gray-300">We respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
