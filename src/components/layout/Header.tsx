'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SemiTruckIcon } from '@/components/ui/SemiTruckIcon'
import { COMPANY } from '@/lib/config'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Resources', href: '/resources' },
    { name: 'Check Status', href: '/status' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`text-white sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-primary-900 shadow-soft-lg'
          : 'bg-primary-800'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-display text-xl font-bold tracking-tight">{COMPANY.shortName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm ${
                  isActive(item.href)
                    ? 'text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/apply">
              <Button variant="secondary" size="sm">Apply Now</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 hover:bg-primary-600 rounded-lg transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="relative w-6 h-6 block">
                <Menu className={`h-6 w-6 absolute inset-0 transition-all duration-200 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`h-6 w-6 absolute inset-0 transition-all duration-200 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-80 pb-4 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block py-2 ${
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
              <Button variant="secondary" className="w-full">Apply Now</Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
