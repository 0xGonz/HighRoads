import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { COMPANY, PROGRAM } from '@/lib/config'

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white border-t border-primary-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-5">
              <span className="font-display text-xl font-bold tracking-tight">{COMPANY.name}</span>
            </div>
            <p className="text-gray-300 max-w-md mb-6 leading-relaxed">
              Performance-based truck ownership program based in {COMPANY.location}.
              Earn your {PROGRAM.truckModels} through our {PROGRAM.profitSplit}/{PROGRAM.profitSplit} profit-split program.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-5 tracking-tight">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="relative inline-block text-gray-300 hover:text-white transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent-400
                  after:transition-all after:duration-300 hover:after:w-full">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/carriers" className="relative inline-block text-gray-300 hover:text-white transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent-400
                  after:transition-all after:duration-300 hover:after:w-full">
                  Carrier Partners
                </Link>
              </li>
              <li>
                <Link href="/faq" className="relative inline-block text-gray-300 hover:text-white transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent-400
                  after:transition-all after:duration-300 hover:after:w-full">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/resources" className="relative inline-block text-gray-300 hover:text-white transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent-400
                  after:transition-all after:duration-300 hover:after:w-full">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/documents" className="relative inline-block text-gray-300 hover:text-white transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent-400
                  after:transition-all after:duration-300 hover:after:w-full">
                  Upload Documents
                </Link>
              </li>
              <li>
                <Link href="/status" className="relative inline-block text-gray-300 hover:text-white transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent-400
                  after:transition-all after:duration-300 hover:after:w-full">
                  Check Status
                </Link>
              </li>
              <li>
                <Link href="/apply" className="relative inline-block text-gray-300 hover:text-white transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-accent-400
                  after:transition-all after:duration-300 hover:after:w-full">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-5 tracking-tight">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${COMPANY.supportEmail}`}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>{COMPANY.supportEmail}</span>
                </a>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>{COMPANY.location}</span>
              </li>
            </ul>

            {/* Legal Links */}
            <div className="mt-6 pt-4 border-t border-primary-700">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-12 pt-8 text-center text-gray-500">
          <p className="text-sm">&copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
