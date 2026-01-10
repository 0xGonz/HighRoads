import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Applicants | High Road Capital LLC',
  description: 'Applicant management has moved to GoHighLevel CRM.',
}

const GHL_CONTACTS_URL = 'https://app.gohighlevel.com/contacts'

export default function ApplicantsPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ExternalLink className="h-8 w-8 text-primary-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Applicants Moved to GHL
        </h1>
        <p className="text-gray-600 mb-6">
          All applicant management is now handled through GoHighLevel CRM.
          Click below to access your contacts.
        </p>
        <a
          href={GHL_CONTACTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4"
        >
          <Button size="lg" className="w-full inline-flex items-center justify-center">
            Open GHL Contacts
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </a>
        <Link href="/admin" className="text-primary-700 hover:underline text-sm">
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  )
}
