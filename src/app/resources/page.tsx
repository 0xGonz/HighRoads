import { Metadata } from 'next'
import { ResourcesHub } from '@/components/blog/ResourcesHub'

export const metadata: Metadata = {
  title: 'Resources & Guides | High Road Capital LLC',
  description: 'Expert guides and tips for truck drivers looking to become owner-operators through lease-to-own programs.',
}

export default function ResourcesPage() {
  return <ResourcesHub />
}
