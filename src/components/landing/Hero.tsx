'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { COMPANY, BENEFITS } from '@/lib/config'

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-truck.jpg"
          alt="Professional truck driver with semi truck"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 w-full">
        <div className="max-w-2xl">
          {/* Trust Badge */}
          <div
            className={`inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20 transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            }`}
          >
            <span className="text-sm font-semibold tracking-wide">{COMPANY.shortName} | {COMPANY.location}</span>
          </div>

          {/* Main heading */}
          <h1
            className={`font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6 transition-all duration-500 delay-100 [text-shadow:_0_4px_24px_rgba(0,0,0,0.3)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="block">STEER YOUR</span>
            <span className="block text-accent-400 [text-shadow:_0_2px_20px_rgba(201,162,39,0.3)]">CAREER FORWARD</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed max-w-xl transition-all duration-500 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Secure Your Future with {COMPANY.shortName}&apos;s Innovative Truck Ownership Program.
          </p>

          {/* Benefits list */}
          <ul className="space-y-3 mb-10">
            {BENEFITS.ownership.map((benefit, index) => (
              <li
                key={benefit}
                className={`flex items-center space-x-3 transition-all duration-400 ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${250 + index * 75}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-accent-400 flex-shrink-0" />
                <span className="text-gray-100 font-medium">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link href="/apply">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 group">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 border-2 border-white/40 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/60 hover:text-white">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
