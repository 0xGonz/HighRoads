import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { COMPANY, PROGRAM } from '@/lib/config'

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <span className="text-lg font-bold">{COMPANY.name}</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Performance-based truck ownership program based in {COMPANY.location}.
              Earn your {PROGRAM.truckModels} through our {PROGRAM.profitSplit}/{PROGRAM.profitSplit} profit-split program.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/carriers" className="text-gray-400 hover:text-white">
                  Carrier Partners
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-400 hover:text-white">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-gray-400 hover:text-white">
                  Upload Documents
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-400 hover:text-white">
                  Check Status
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-gray-400 hover:text-white">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${COMPANY.supportEmail}`}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  <span>{COMPANY.supportEmail}</span>
                </a>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{COMPANY.location}</span>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-primary-700">
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
