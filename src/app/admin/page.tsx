import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Users, BarChart3, MessageSquare, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Admin Dashboard | High Road Capital LLC',
  description: 'Admin dashboard - Redirects to GoHighLevel CRM.',
}

const GHL_DASHBOARD_URL = 'https://app.gohighlevel.com'

const ghlFeatures = [
  {
    title: 'Contact Management',
    description: 'View, edit, and manage all applicant contacts',
    icon: Users,
  },
  {
    title: 'Pipeline Tracking',
    description: 'Track applications through your sales pipeline',
    icon: BarChart3,
  },
  {
    title: 'Automated Messaging',
    description: 'Email and SMS automation for follow-ups',
    icon: MessageSquare,
  },
  {
    title: 'Workflow Automation',
    description: 'Automated sequences for abandoned forms and nurturing',
    icon: Settings,
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-primary-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-200 mt-1">Applicant management has moved to GoHighLevel</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main CTA Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExternalLink className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Manage Applicants in GoHighLevel
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            All applicant data, pipeline management, and automated follow-ups are now handled
            through GoHighLevel CRM for a more powerful and integrated experience.
          </p>
          <a
            href={GHL_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="inline-flex items-center">
              Open GoHighLevel Dashboard
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {ghlFeatures.map((feature) => (
            <div key={feature.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <feature.icon className="h-6 w-6 text-primary-700" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">GHL Setup Checklist</h3>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              Create custom fields for application data (CDL, medical card, experience, etc.)
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              Set up pipeline stages: New → In Progress → Carrier App → Pending → Complete
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              Create workflows for new applications and abandoned form follow-ups
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              Configure email/SMS templates for confirmations and reminders
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-primary-700 hover:underline">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  )
}
