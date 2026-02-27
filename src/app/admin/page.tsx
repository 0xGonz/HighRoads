import { Metadata } from 'next'
import Link from 'next/link'
import { Users, UserCheck, Clock, CheckCircle, ArrowRight, TrendingUp, FileCheck } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { getDashboardStats } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { statusColors } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'Admin Dashboard | High Road Capital LLC',
  description: 'Admin dashboard for managing applicants and applications.',
}

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  const stats = await getDashboardStats()

  const statCards = [
    {
      title: 'Total Applicants',
      value: stats.total,
      icon: Users,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
    },
    {
      title: 'New Applications',
      value: stats.new,
      icon: Clock,
      iconBg: statusColors.new.light,
      iconColor: statusColors.new.icon,
    },
    {
      title: 'Prequalified',
      value: stats.prequalified,
      icon: UserCheck,
      iconBg: statusColors.complete.light,
      iconColor: statusColors.complete.icon,
    },
    {
      title: 'Completed',
      value: stats.complete,
      icon: CheckCircle,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {admin.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Applications</h2>
              <Link
                href="/admin/applicants"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.recentApplications.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No applications yet
                </div>
              ) : (
                stats.recentApplications.map((applicant) => (
                  <Link
                    key={applicant.id}
                    href={`/admin/applicants/${applicant.id}`}
                    className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {applicant.first_name} {applicant.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{applicant.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={applicant.status} size="sm" />
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats by Status */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Pipeline Overview</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <PipelineBar label="New" count={stats.new} total={stats.total} color={statusColors.new.dot} />
                <PipelineBar label="In Progress" count={stats.inProgress} total={stats.total} color={statusColors.in_progress.dot} />
                <PipelineBar label="Prequalified" count={stats.prequalified} total={stats.total} color={statusColors.complete.dot} />
                <PipelineBar label="Completed" count={stats.complete} total={stats.total} color="bg-purple-500" />
              </div>
              <div className="mt-6 pt-4 border-t">
                <Link
                  href="/admin/pipeline"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View pipeline board
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function PipelineBar({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{percentage}%</span>
          <span className="font-semibold text-gray-900 tabular-nums w-8 text-right">{count}</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    </div>
  )
}
