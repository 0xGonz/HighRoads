import { Metadata } from 'next'
import { DocumentUpload } from '@/components/documents/DocumentUpload'

export const metadata: Metadata = {
  title: 'Upload Documents | High Road Capital LLC',
  description: 'Upload your CDL, medical card, and other required documents for your lease-to-own application.',
}

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Upload Your Documents
          </h1>
          <p className="text-lg text-gray-600">
            Submit your required documents to complete your application. All files are securely encrypted.
          </p>
        </div>

        <DocumentUpload />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Need help?</h3>
          <p className="text-sm text-blue-700">
            If you have trouble uploading documents, you can email them directly to{' '}
            <a href="mailto:documents@highroadcapitalllc.com" className="underline">
              documents@highroadcapitalllc.com
            </a>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}
