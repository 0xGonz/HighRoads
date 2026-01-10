import { Metadata } from 'next'
import { ApplicationForm } from '@/components/forms/ApplicationForm'
import { Shield, Clock, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Apply Now | High Road Capital LLC',
  description: 'Start your journey to truck ownership. Complete our simple application to get pre-approved for our lease-to-own program.',
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f2d4a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Hero section */}
      <div className="relative bg-primary-800 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Start Your Application
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Take the first step toward truck ownership. Our simple application takes just a few minutes.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="h-4 w-4 text-accent" />
              <span>5 minute application</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="h-4 w-4 text-accent" />
              <span>Secure & confidential</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>No commitment required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApplicationForm />

          <p className="text-center text-sm text-gray-500 mt-8">
            Your information is secure and will only be used to process your application.
            <br />
            We respond to all applications within one business day.
          </p>
        </div>
      </div>
    </div>
  )
}
