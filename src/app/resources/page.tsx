import { Metadata } from 'next'
import { Suspense } from 'react'
import { ResourcesHub } from '@/components/blog/ResourcesHub'

export const metadata: Metadata = {
  title: 'Resources & Guides | High Road Capital LLC',
  description: 'Expert guides and tips for truck drivers looking to become owner-operators through lease-to-own programs.',
}

function ResourcesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold">Resources</h1>
            <p className="text-primary-200 mt-2">
              Guides, articles, and tools for owner-operators.
            </p>
          </div>
        </div>
      </div>
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<ResourcesLoading />}>
      <ResourcesHub />
    </Suspense>
  )
}
