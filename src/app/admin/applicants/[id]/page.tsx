import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { CustomBreadcrumbs } from '@/components/admin/Breadcrumbs'
import { findApplicantById, getApplicantDocuments, getApplicantActivityLog } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { ApplicantDetailClient } from './ApplicantDetailClient'

export const metadata: Metadata = {
  title: 'Applicant Details | Admin Dashboard',
  description: 'View and manage applicant details.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicantDetailPage({ params }: PageProps) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  const { id } = await params
  const applicant = await findApplicantById(id)

  if (!applicant) {
    notFound()
  }

  const documents = await getApplicantDocuments(id)
  const activityLog = await getApplicantActivityLog(id)

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-4">
        {/* Custom breadcrumbs with applicant name */}
        <CustomBreadcrumbs
          items={[
            { label: 'Applicants', href: '/admin/applicants' },
            { label: `${applicant.first_name} ${applicant.last_name}` },
          ]}
        />

        <ApplicantDetailClient
          applicant={applicant}
          documents={documents}
          activityLog={activityLog}
        />
      </div>
    </AdminLayout>
  )
}
