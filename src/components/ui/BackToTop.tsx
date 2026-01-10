'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100

      setScrollProgress(progress)
      setIsVisible(scrollTop > 400)
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 group transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      {/* Progress ring */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-accent transition-all duration-150"
            style={{
              strokeDasharray: `${2 * Math.PI * 20}`,
              strokeDashoffset: `${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`,
            }}
          />
        </svg>

        {/* Button center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-white rounded-full shadow-soft-lg flex items-center justify-center group-hover:shadow-soft-xl group-hover:scale-110 transition-all duration-200">
            <ArrowUp className="w-5 h-5 text-primary-800 group-hover:text-accent transition-colors" />
          </div>
        </div>
      </div>
    </button>
  )
}
