'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Marcus Johnson',
    role: 'Owner Operator',
    stats: '2 Years | 185,000 Miles',
    rating: 5,
    quote: 'High Road changed my life. After 10 years of driving for companies, I finally own my truck. The payment plan worked perfectly with my income, and the support team was there every step of the way.',
    location: 'Dallas, TX',
    gradient: 'from-accent to-orange-400',
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Owner Operator',
    stats: '18 Months | 142,000 Miles',
    rating: 5,
    quote: 'I was skeptical at first, but this program delivered on every promise. No hidden fees, great truck selection, and they matched me with an amazing carrier. Best decision I ever made.',
    location: 'Atlanta, GA',
    gradient: 'from-primary-500 to-primary-400',
  },
  {
    id: 3,
    name: 'Roberto Garcia',
    role: 'Owner Operator',
    stats: '3 Years | 280,000 Miles',
    rating: 5,
    quote: 'The mentorship program is incredible. They paired me with an experienced driver who helped me navigate the business side of trucking. I\'m now 80% equity in my truck.',
    location: 'Phoenix, AZ',
    gradient: 'from-green-500 to-green-400',
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle transition timing
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  const next = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((current) => (current + 1) % testimonials.length)
    }, 150)
  }

  const prev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
    }, 150)
  }

  const jumpTo = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
    }, 150)
  }

  const testimonial = testimonials[currentIndex]

  return (
    <section className="py-24 lg:py-28 bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-display tracking-heading text-3xl md:text-4xl font-bold mb-5">
            Driver Success Stories
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Hear from real drivers who have transformed their careers through the High Road program.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-14 shadow-soft-xl border border-white/5">
            <Quote className="absolute top-8 left-8 h-12 w-12 text-accent opacity-40" />

            {/* Crossfade content wrapper */}
            <div
              className={`relative z-10 transition-opacity duration-300 ease-in-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-accent fill-accent" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-center mb-8 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-soft-lg`}>
                    <span className="text-2xl font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-full ring-2 ring-white/20 ring-offset-2 ring-offset-primary-600" />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className="font-semibold text-lg">{testimonial.name}</p>
                    <span className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                  <p className="text-gray-300">{testimonial.role}</p>
                  <p className="text-accent text-sm font-medium">{testimonial.stats}</p>
                  <p className="text-gray-400 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={prev}
                disabled={isTransitioning}
                className="p-2 bg-primary-500 hover:bg-primary-400 rounded-full transition-colors disabled:opacity-50"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpTo(idx)}
                    disabled={isTransitioning}
                    className={`rounded-full transition-all duration-200 ${
                      idx === currentIndex
                        ? 'bg-accent w-6 h-3'
                        : 'bg-white/30 w-3 h-3 hover:bg-white/50'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                disabled={isTransitioning}
                className="p-2 bg-primary-500 hover:bg-primary-400 rounded-full transition-colors disabled:opacity-50"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
