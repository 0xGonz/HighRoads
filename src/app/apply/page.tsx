import { Metadata } from 'next'
import { ApplicationForm } from '@/components/forms/ApplicationForm'

export const metadata: Metadata = {
  title: 'Apply Now | High Road Technologies',
  description: 'Start your journey to truck ownership. Complete our simple application to get pre-approved for our lease-to-own program.',
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Start Your Application
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take the first step toward truck ownership. Our simple application takes just a few minutes.
          </p>
        </div>

        <ApplicationForm />

        <p className="text-center text-sm text-gray-500 mt-8">
          Your information is secure and will only be used to process your application.
        </p>
      </div>
    </div>
  )
}
