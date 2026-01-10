'use client'

import { ClipboardCheck, Truck, Shield, Award } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { PROGRAM, COMPANY } from '@/lib/config'

const steps = [
  {
    number: '01',
    icon: ClipboardCheck,
    title: 'Apply & Get Approved',
    description: 'Simple application with no credit check. We review your CDL, experience, and driving record. Get a response within 24 hours.',
  },
  {
    number: '02',
    icon: Truck,
    title: 'Choose Carrier & Truck',
    description: `Select from our approved carrier partners and get your ${PROGRAM.truckModels}. Carriers provide freight, fuel cards, insurance, and compliance.`,
  },
  {
    number: '03',
    icon: Shield,
    title: `Complete ${PROGRAM.provingGroundWeeks}-Week Proving Ground`,
    description: `Demonstrate consistent performance. Truck must generate $${PROGRAM.provingGroundMinimum}/week for ${COMPANY.shortName}. Earnings above this go to you.`,
  },
  {
    number: '04',
    icon: Award,
    title: 'Earn Your Truck',
    description: `After Proving Ground, net revenue is split ${PROGRAM.profitSplit}/${PROGRAM.profitSplit}. High performers can own in as little as 1 year.`,
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-800 mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started is easy. Follow these steps to begin your journey to truck ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Connector line - animates in */}
              {index < steps.length - 1 && (
                <div
                  className={`hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-primary-400 origin-left transition-transform duration-700 ${
                    isVisible ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 150 + 200}ms` }}
                />
              )}

              {/* Card */}
              <div className="group relative bg-white rounded-2xl p-7 text-center shadow-soft border border-gray-100/50
                transition-all duration-300 ease-out
                hover:shadow-soft-lg hover:-translate-y-1 hover:border-primary-200/50">
                <div className="relative inline-block mb-5">
                  {/* Icon circle */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-800 to-primary-700 rounded-full flex items-center justify-center mx-auto shadow-soft
                    transition-all duration-300
                    group-hover:from-primary-700 group-hover:to-primary-600
                    group-hover:scale-110 group-hover:shadow-soft-lg">
                    <step.icon className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  {/* Number badge - pops in */}
                  <span
                    className={`absolute -top-1 -right-1 w-7 h-7 bg-accent-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-soft transition-all duration-300 ${
                      isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 150 + 300}ms` }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-primary-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
