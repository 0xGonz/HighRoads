import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { KanbanBoard } from '@/components/admin/KanbanBoard'
import { getApplicantsByStatus } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { ChevronDown, XCircle } from 'lucide-react'
import { statusColors } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: 'Pipeline | Admin Dashboard',
  description: 'View and manage applicants in pipeline view.',
}

export const dynamic = 'force-dynamic'

export default async function PipelinePage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  const applicantsByStatus = await getApplicantsByStatus()

  // Calculate totals for header
  const totalActive = Object.entries(applicantsByStatus)
    .filter(([status]) => status !== 'disqualified')
    .reduce((sum, [, applicants]) => sum + applicants.length, 0)

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-gray-500 mt-1">
            Drag and drop applicants to update their status. {totalActive} active applicants.
          </p>
        </div>

        {/* Kanban Board */}
        <KanbanBoard applicantsByStatus={applicantsByStatus} />

        {/* Disqualified Section (collapsed by default) */}
        {applicantsByStatus.disqualified?.length > 0 && (
          <details className="bg-white rounded-xl shadow-sm group">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors list-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusColors.disqualified.light}`}>
                    <XCircle className={`h-5 w-5 ${statusColors.disqualified.icon}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Disqualified</h3>
                    <p className="text-sm text-gray-500">{applicantsByStatus.disqualified.length} applicants</p>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
              </div>
            </summary>
            <div className="p-4 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applicantsByStatus.disqualified.map((applicant) => (
                <a
                  key={applicant.id}
                  href={`/admin/applicants/${applicant.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-red-200 hover:bg-red-50/50 transition-colors group/card"
                >
                  <p className="font-medium text-gray-900 group-hover/card:text-red-900">
                    {applicant.first_name} {applicant.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{applicant.email}</p>
                  {applicant.disqualification_reason && (
                    <p className="text-xs text-red-600 mt-2 flex items-start gap-1">
                      <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {applicant.disqualification_reason}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </details>
        )}
      </div>
    </AdminLayout>
  )
}
