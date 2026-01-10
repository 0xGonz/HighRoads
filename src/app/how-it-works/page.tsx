'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  Truck,
  DollarSign,
  Clock,
  Shield,
  Users,
  LogOut,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/layout/PageHero'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { COMPANY, PROGRAM, BENEFITS } from '@/lib/config'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'ownership', label: 'Ownership Path', icon: Clock },
  { id: 'proving-ground', label: 'Proving Ground', icon: Shield },
  { id: 'carrier', label: 'Carrier Flexibility', icon: Users },
]

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Update tab indicator position
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab)
    const activeButton = tabRefs.current[activeIndex]
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      })
    }
  }, [activeTab])

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTab(tabId)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 150)
  }

  return (
    <div>
      <PageHero
        title="Program Details"
        subtitle={`${COMPANY.name} — Performance-Based Ownership Program`}
      />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto -mb-px relative">
            {/* Animated indicator */}
            <div
              className="absolute bottom-0 h-0.5 bg-primary-700 transition-all duration-300 ease-out"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[index] = el }}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-4 border-b-2 border-transparent font-medium text-sm whitespace-nowrap transition-colors duration-200',
                  activeTab === tab.id
                    ? 'text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <tab.icon className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  activeTab === tab.id && "scale-110"
                )} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content with Transition */}
      <div
        className={cn(
          "bg-white transition-all duration-200 ease-out",
          isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        )}
      >
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'ownership' && <OwnershipTab />}
        {activeTab === 'proving-ground' && <ProvingGroundTab />}
        {activeTab === 'carrier' && <CarrierTab />}
      </div>

      {/* CTA */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning Your Truck?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Limited {PROGRAM.truckModels} sleeper trucks available. Nationwide carriers accepted. Fast onboarding.
          </p>
          <Link href="/apply">
            <Button variant="secondary" size="lg" className="text-lg">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <AnimateIn animation="fade-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-lg text-gray-600 leading-relaxed">
              {COMPANY.shortName} currently offers {PROGRAM.truckYears} {PROGRAM.truckModel} sleeper trucks
              to qualified CDL drivers through our Performance-Based Ownership Program. This program provides
              a fair, transparent path to owning a late-model semi-truck without credit checks, down payments,
              or repair bills.
            </p>
          </div>
        </AnimateIn>

        {/* What We Provide */}
        <div className="mb-16">
          <AnimateIn animation="fade-up">
            <h2 className="text-2xl font-bold text-primary-800 mb-8 text-center">What We Provide</h2>
          </AnimateIn>
          <AnimateIn animation="scale" delay={100}>
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-8 max-w-3xl mx-auto
              transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
              <p className="text-gray-600 mb-6">Trucks in the program include:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0
                    transition-all duration-300 group-hover:bg-primary-200 group-hover:scale-110">
                    <Truck className="h-4 w-4 text-primary-700" />
                  </div>
                  <span className="text-gray-700 font-medium mt-1">A {PROGRAM.truckYears} {PROGRAM.truckModel} sleeper</span>
                </li>
                {PROGRAM.included.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 group"
                    style={{ animationDelay: `${(index + 1) * 50}ms` }}>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 mt-1">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-gray-500">
                Drivers choose an approved carrier and operate the truck through that carrier.
              </p>
            </div>
          </AnimateIn>
        </div>

        {/* How the Money Works */}
        <div className="mb-16">
          <AnimateIn animation="fade-up">
            <h2 className="text-2xl font-bold text-primary-800 mb-8 text-center">How the Money Works</h2>
          </AnimateIn>
          <AnimateIn animation="fade-up" delay={100}>
            <div className="bg-gray-50 rounded-lg p-8 max-w-3xl mx-auto">
              <div className="space-y-4 text-gray-600">
                <p>
                  The carrier pays {COMPANY.shortName} each week. Fuel, insurance, tolls, and other operating
                  costs are deducted by the carrier. The remaining net revenue is then split between the driver
                  and {COMPANY.shortName} once the truck qualifies for the standard split.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 text-center shadow-soft
                  transition-all duration-300 hover:shadow-soft-lg hover:scale-105">
                  <div className="text-4xl font-bold text-primary-700">{PROGRAM.profitSplit}%</div>
                  <div className="text-sm text-gray-600 mt-1">To You</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-soft
                  transition-all duration-300 hover:shadow-soft-lg hover:scale-105">
                  <div className="text-4xl font-bold text-primary-700">{PROGRAM.profitSplit}%</div>
                  <div className="text-sm text-gray-600 mt-1">To {COMPANY.shortName}</div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* No... Section */}
        <div className="max-w-3xl mx-auto">
          <AnimateIn animation="fade-up">
            <h2 className="text-2xl font-bold text-primary-800 mb-8 text-center">What Makes Us Different</h2>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {BENEFITS.highlights.map((item, index) => (
              <AnimateIn key={item} animation="scale" delay={index * 75}>
                <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4
                  transition-all duration-300 hover:bg-green-100 hover:shadow-soft">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-gray-800">{item}</span>
                </div>
              </AnimateIn>
            ))}
          </div>
          <AnimateIn animation="fade" delay={400}>
            <p className="text-center text-gray-600 mt-6 font-medium">
              Ownership is earned through performance.
            </p>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}

function OwnershipTab() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <AnimateIn animation="fade-up">
            <h2 className="text-2xl font-bold text-primary-800 mb-4 text-center">Your Ownership Path</h2>
            <p className="text-gray-600 text-center mb-12">
              Drivers earn ownership based on how much profit the truck generates for {COMPANY.shortName}:
            </p>
          </AnimateIn>

          {/* Ownership Timeline Table */}
          <AnimateIn animation="scale" delay={100}>
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 overflow-hidden mb-12
              transition-all duration-300 hover:shadow-soft-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-800">
                      HRC Weekly Earnings
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-primary-800">
                      Time to Ownership
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PROGRAM.ownershipTimeline.map((tier, index) => (
                    <tr
                      key={tier.hrcWeeklyEarnings}
                      className={cn(
                        'transition-all duration-300 hover:bg-gray-50',
                        index === PROGRAM.ownershipTimeline.length - 1 && 'bg-green-50 hover:bg-green-100'
                      )}
                      style={{
                        animation: 'fade-in-up 0.5s ease-out forwards',
                        animationDelay: `${index * 100}ms`,
                        opacity: 0,
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          ${tier.hrcWeeklyEarnings.toLocaleString()}
                        </span>
                        <span className="text-gray-500">/week</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          'font-bold inline-flex items-center gap-2',
                          index === PROGRAM.ownershipTimeline.length - 1 ? 'text-green-700' : 'text-primary-700'
                        )}>
                          {tier.yearsToOwnership} {tier.yearsToOwnership === 1 ? 'year' : 'years'}
                          {index === PROGRAM.ownershipTimeline.length - 1 && (
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium">
                              Fastest
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateIn>

          {/* Walk Away Option */}
          <AnimateIn animation="fade-up" delay={200}>
            <div className="group bg-white rounded-lg shadow-soft border border-gray-100 p-8
              transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0
                  transition-all duration-300 group-hover:bg-primary-200 group-hover:scale-110">
                  <LogOut className="h-6 w-6 text-primary-700" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-800 text-lg mb-2">Walk-Away Option</h3>
                  <p className="text-gray-600">
                    Life happens. Drivers may exit the program by returning the truck in operating condition
                    and settling any outstanding balances. There are no debt traps or forced buyouts.
                  </p>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}

function ProvingGroundTab() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Proving Ground */}
          <AnimateIn animation="fade-up">
            <div className="group bg-white rounded-lg shadow-soft border border-gray-100 p-8 mb-8
              transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0
                  transition-all duration-300 group-hover:bg-primary-200 group-hover:scale-110">
                  <Shield className="h-6 w-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-800 mb-1">
                    Proving Ground (First {PROGRAM.provingGroundWeeks} Weeks)
                  </h2>
                  <p className="text-gray-500">Demonstrate consistent, professional operation</p>
                </div>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  All new drivers begin with a {PROGRAM.provingGroundWeeks}-week Proving Ground. This period
                  ensures that the truck is being run consistently and professionally.
                </p>
                <div className="bg-primary-50 rounded-xl p-4 transition-all duration-300 hover:bg-primary-100">
                  <p className="font-medium text-primary-800">
                    During the first {PROGRAM.provingGroundWeeks} weeks, the truck must generate at least{' '}
                    <span className="font-bold">${PROGRAM.provingGroundMinimum}/week</span> for {COMPANY.shortName}.
                  </p>
                  <p className="text-sm text-primary-700 mt-2">
                    Any earnings above this amount are paid to the driver.
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Drivers who do not meet this minimum may be removed from the program.
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* Ongoing Requirements */}
          <AnimateIn animation="fade-up" delay={100}>
            <div className="group bg-white rounded-lg shadow-soft border border-gray-100 p-8 mb-8
              transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0
                  transition-all duration-300 group-hover:bg-primary-200 group-hover:scale-110">
                  <Clock className="h-6 w-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-800 mb-1">Ongoing Performance Requirement</h2>
                  <p className="text-gray-500">After the Proving Ground period</p>
                </div>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  After the Proving Ground, the truck must maintain an average of at least{' '}
                  <span className="font-bold text-primary-800">${PROGRAM.ongoingMinimum}/week</span> for {COMPANY.shortName}.
                </p>
                <p>
                  Drivers who fail to maintain this average may be removed so the truck can be reassigned.
                </p>
                <p className="text-sm text-gray-500 italic">
                  This standard keeps the program fair, stable, and profitable for everyone.
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* Standard Split */}
          <AnimateIn animation="scale" delay={200}>
            <div className="bg-primary-800 text-white rounded-lg p-8 transition-all duration-300 hover:shadow-glow-accent-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0
                  transition-all duration-300 hover:bg-white/30 hover:scale-110">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Standard Profit Split</h2>
                  <p className="text-white/70">After requirements are met</p>
                </div>
              </div>
              <p className="text-white/90">
                Once the Proving Ground is completed and performance requirements are met, the remaining
                net revenue from the truck is split:
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-6 text-center transition-all duration-300 hover:bg-white/20 hover:scale-105">
                  <div className="text-4xl font-bold">{PROGRAM.profitSplit}%</div>
                  <div className="text-sm text-white/70 mt-1">To Driver</div>
                </div>
                <div className="bg-white/10 rounded-xl p-6 text-center transition-all duration-300 hover:bg-white/20 hover:scale-105">
                  <div className="text-4xl font-bold">{PROGRAM.profitSplit}%</div>
                  <div className="text-sm text-white/70 mt-1">To {COMPANY.shortName}</div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}

function CarrierTab() {
  const carrierRules = [
    {
      value: PROGRAM.carrierMinDays,
      title: 'Day Minimum',
      description: 'Minimum days with each carrier',
    },
    {
      value: PROGRAM.maxCarrierChangesPerYear,
      title: 'Maximum Changes Per Year',
      description: 'Carrier changes allowed per year',
    },
    {
      value: `$${PROGRAM.carrierTransitionReserve}`,
      title: 'Transition Reserve',
      description: 'Held when switching carriers',
      small: true,
    },
  ]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <AnimateIn animation="fade-up">
            <h2 className="text-2xl font-bold text-primary-800 mb-4 text-center">Carrier Flexibility</h2>
            <p className="text-gray-600 text-center mb-12">
              You choose your carrier. We provide the truck.
            </p>
          </AnimateIn>

          {/* Rules */}
          <AnimateIn animation="scale" delay={100}>
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-8 mb-8
              transition-all duration-300 hover:shadow-soft-lg">
              <h3 className="font-bold text-primary-800 text-lg mb-6">
                Carrier Rules to Protect Earnings and Stability
              </h3>
              <div className="space-y-4">
                {carrierRules.map((rule, index) => (
                  <div
                    key={rule.title}
                    className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl
                      transition-all duration-300 hover:bg-gray-100 hover:shadow-soft"
                    style={{
                      animation: 'fade-in-up 0.4s ease-out forwards',
                      animationDelay: `${index * 100 + 200}ms`,
                      opacity: 0,
                    }}
                  >
                    <div className={cn(
                      "w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0",
                      "transition-all duration-300 group-hover:bg-primary-200 group-hover:scale-110"
                    )}>
                      <span className={cn(
                        "font-bold text-primary-700",
                        rule.small && "text-sm"
                      )}>
                        {rule.value}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{rule.title}</div>
                      <div className="text-sm text-gray-600">{rule.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>

          {/* Who This Is For */}
          <AnimateIn animation="fade-up" delay={300}>
            <div className="bg-primary-50 rounded-lg p-8 transition-all duration-300 hover:bg-primary-100 hover:shadow-soft">
              <h3 className="font-bold text-primary-800 text-lg mb-4">Who This Program Is For</h3>
              <p className="text-gray-700">
                This program is built for professional drivers who want real ownership, freedom to choose
                their carrier, and a serious path to building a trucking business.
              </p>
            </div>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}
