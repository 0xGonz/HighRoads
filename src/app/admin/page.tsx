import { Metadata } from 'next'
import Link from 'next/link'
import { Users, Clock, CheckCircle, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard | High Road Technologies',
  description: 'Admin dashboard for managing applicants and tracking pipeline.',
}

const stats = [
  { name: 'Total Applicants', value: '—', icon: Users, color: 'bg-blue-500' },
  { name: 'New This Week', value: '—', icon: TrendingUp, color: 'bg-green-500' },
  { name: 'Pending Review', value: '—', icon: Clock, color: 'bg-yellow-500' },
  { name: 'Completed', value: '—', icon: CheckCircle, color: 'bg-purple-500' },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-primary-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-200 mt-1">Manage applicants and track your pipeline</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/applicants"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-primary-700 mr-4" />
              <div>
                <p className="font-medium text-gray-900">View All Applicants</p>
                <p className="text-sm text-gray-500">Manage and review applications</p>
              </div>
            </Link>
            <Link
              href="/admin/applicants?status=new"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Clock className="h-8 w-8 text-yellow-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">New Applications</p>
                <p className="text-sm text-gray-500">Review pending submissions</p>
              </div>
            </Link>
            <Link
              href="/admin/applicants?status=complete"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">Completed</p>
                <p className="text-sm text-gray-500">View completed applications</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">Setup Required</h3>
          <p className="text-blue-700 text-sm mb-4">
            To see live data, make sure you&apos;ve configured your Supabase connection in the <code className="bg-blue-100 px-1 rounded">.env.local</code> file
            and run the database schema SQL in your Supabase project.
          </p>
          <p className="text-blue-700 text-sm">
            The stats above will update automatically once the database is connected.
          </p>
        </div>
      </div>
    </div>
  )
}
