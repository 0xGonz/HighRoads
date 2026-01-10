import { Metadata } from 'next'
import Link from 'next/link'
import {
  Truck,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  ArrowRight,
  Shield,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/layout/PageHero'
import { COMPANY, CARRIER_INFO, PROGRAM } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Carrier Partners | High Road Capital LLC',
  description: 'Partner with High Road Capital to add trucks to your fleet without purchasing equipment. We provide late-model Peterbilt trucks to qualified drivers.',
}

export default function CarriersPage() {
  return (
    <div>
      <PageHero
        title="Carrier Partnership"
        subtitle={`${COMPANY.name} — Carrier Partnership Overview`}
      />

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              {COMPANY.name} is a truck ownership and placement platform that helps motor carriers
              grow by supplying professionally maintained, late-model trucks for qualified drivers.
            </p>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-800 mb-8 text-center">What {COMPANY.shortName} Provides</h2>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
              <p className="text-gray-600 mb-6">
                {COMPANY.shortName} owns and maintains a growing fleet of late-model sleeper trucks,
                including {PROGRAM.truckYears} {PROGRAM.truckModel}s, that are available to be placed
                with carriers through approved drivers.
              </p>
              <h3 className="font-semibold text-primary-800 mb-4">We provide:</h3>
              <ul className="space-y-3">
                {CARRIER_INFO.whatWeProvide.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-gray-500 bg-primary-50 rounded-lg p-4">
                Carriers receive reliable, fully equipped trucks without tying up capital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Drivers Are Placed */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-800 mb-8 text-center">How Drivers Are Placed</h2>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 mb-8">
              <p className="text-gray-600 mb-6">
                {CARRIER_INFO.howDriversArePlaced}
              </p>
              <h3 className="font-semibold text-primary-800 mb-4">Carriers remain fully responsible for:</h3>
              <ul className="space-y-3">
                {CARRIER_INFO.carrierResponsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary-700 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clarifications */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-semibold text-primary-800 mb-4">Important Clarifications</h3>
              <ul className="space-y-3">
                {CARRIER_INFO.clarifications.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How Partnership Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-800 mb-8 text-center">How the Partnership Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary-700" />
                  </div>
                  <h3 className="font-semibold text-primary-800">Carrier Provides</h3>
                </div>
                <ul className="space-y-2">
                  {CARRIER_INFO.carrierProvides.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary-700" />
                  </div>
                  <h3 className="font-semibold text-primary-800">{COMPANY.shortName} Provides</h3>
                </div>
                <p className="text-sm text-gray-600">
                  The truck — and ensures it remains maintained and operational at all times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Carriers Partner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-800 mb-8 text-center">Why Carriers Work With {COMPANY.shortName}</h2>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 mb-8">
              <p className="text-gray-600 mb-6">Our model allows carriers to:</p>
              <ul className="space-y-3">
                {CARRIER_INFO.whyCarriersPartner.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8">
              <p className="text-primary-800 font-medium text-center">
                Because drivers are working toward owning their truck, they are more committed,
                careful, and consistent than traditional lease or rental drivers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Goal */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary-800 mb-6">Our Goal</h2>
            <p className="text-lg text-gray-600">
              {COMPANY.shortName}&apos;s goal is to become a national truck supply and ownership
              platform that carriers can rely on to keep trucks on the road and drivers motivated.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Partner With Us</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            If your carrier needs additional trucks to onboard drivers or grow your fleet,
            {COMPANY.shortName} can supply the equipment.
          </p>
          <Link href={`mailto:${COMPANY.email}`}>
            <Button variant="secondary" size="lg" className="text-lg">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
