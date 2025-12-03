'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Marcus Johnson',
    role: 'Owner Operator - 2 Years',
    image: null, // Placeholder
    rating: 5,
    quote: 'High Road changed my life. After 10 years of driving for companies, I finally own my truck. The payment plan worked perfectly with my income, and the support team was there every step of the way.',
    location: 'Dallas, TX',
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Owner Operator - 18 Months',
    image: null,
    rating: 5,
    quote: 'I was skeptical at first, but this program delivered on every promise. No hidden fees, great truck selection, and they matched me with an amazing carrier. Best decision I ever made.',
    location: 'Atlanta, GA',
  },
  {
    id: 3,
    name: 'Roberto Garcia',
    role: 'Owner Operator - 3 Years',
    image: null,
    rating: 5,
    quote: 'The mentorship program is incredible. They paired me with an experienced driver who helped me navigate the business side of trucking. I\'m now 80% equity in my truck.',
    location: 'Phoenix, AZ',
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((current) => (current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  const testimonial = testimonials[currentIndex]

  return (
    <section className="py-20 bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Driver Success Stories
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Hear from real drivers who have transformed their careers through the High Road program.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-primary-600 rounded-2xl p-8 md:p-12">
            <Quote className="absolute top-6 left-6 h-12 w-12 text-accent opacity-50" />

            <div className="relative z-10">
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
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">{testimonial.name}</p>
                  <p className="text-gray-300">{testimonial.role}</p>
                  <p className="text-gray-400 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={prev}
                className="p-2 bg-primary-500 hover:bg-primary-400 rounded-full transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-accent' : 'bg-primary-400'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="p-2 bg-primary-500 hover:bg-primary-400 rounded-full transition-colors"
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
