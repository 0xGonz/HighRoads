'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEffect, useState, useRef } from 'react'
import { COMPANY, BENEFITS } from '@/lib/config'

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    // Ensure video plays on mobile
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, video will show first frame
      })
    }
  }, [])

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] text-white overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-truck.jpg"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/75 to-primary-900/50" />
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
            className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 transition-all duration-500 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Own Your Truck Through Performance
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl transition-all duration-500 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            No credit check. No down payment. Earn ownership through a 50/50 profit split with {COMPANY.shortName}.
          </p>

          {/* Benefits list */}
          <ul className="space-y-2 mb-10">
            {BENEFITS.ownership.map((benefit, index) => (
              <li
                key={benefit}
                className={`flex items-center space-x-3 transition-all duration-400 ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${250 + index * 75}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-200">{benefit}</span>
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
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white text-primary-800 border-white hover:bg-gray-100">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
