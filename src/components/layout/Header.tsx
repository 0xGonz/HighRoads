'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-primary-700 text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
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
                className={`transition-colors pb-1 ${
                  isActive(item.href)
                    ? 'text-white border-b-2 border-accent'
                    : 'text-gray-200 hover:text-white border-b-2 border-transparent'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/apply">
              <Button size="sm">Apply Now</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 hover:bg-primary-600 rounded-lg transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          }`}
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block py-2 transition-colors ${
                isActive(item.href)
                  ? 'text-white font-semibold'
                  : 'text-gray-200 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-4">
            <Link href="/apply" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">Apply Now</Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
