import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-primary-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Own Your Own Truck.
            <span className="text-accent block">Start for $0 Down.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Join the High Road program and build equity in your own truck while driving for top-paying carriers.
          </p>

          <ul className="space-y-3 mb-10">
            {[
              'Flexible weekly payments that fit your budget',
              'No credit check required',
              'Full support, training, and mentorship',
              'Build equity with every mile you drive',
            ].map((benefit) => (
              <li key={benefit} className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-lg text-gray-100">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center border-2 border-white hover:bg-white hover:text-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative truck silhouette */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-5 hidden lg:block">
        <svg viewBox="0 0 640 512" fill="currentColor" className="absolute bottom-0 right-0 w-full h-auto">
          <path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"/>
        </svg>
      </div>
    </section>
  )
}
