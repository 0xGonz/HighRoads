'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Truck } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ]

  return (
    <header className="bg-primary-700 text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">High Road</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-200 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/apply"
              className="bg-accent hover:bg-accent-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-200 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/apply"
              className="block mt-4 bg-accent hover:bg-accent-600 text-white px-6 py-2 rounded-lg font-semibold text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Apply Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
