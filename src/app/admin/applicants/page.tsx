import { Metadata } from 'next'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ApplicantTable } from '@/components/admin/ApplicantTable'
import { listApplicants } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Search } from 'lucide-react'
import Link from 'next/link'
import type { ApplicantStatus } from '@/types/database'

export const metadata: Metadata = {
  title: 'Applicants | Admin Dashboard',
  description: 'Manage all applicants.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    prequalified?: string
  }>
}

const statusFilters: { value: string; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'carrier_app', label: 'Carrier App' },
  { value: 'pending', label: 'Pending' },
  { value: 'complete', label: 'Complete' },
  { value: 'disqualified', label: 'Disqualified' },
]

export default async function ApplicantsPage({ searchParams }: PageProps) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const page = parseInt(params.page || '1')
  const search = params.search || ''
  const status = params.status as ApplicantStatus | undefined
  const prequalified = params.prequalified === 'true' ? true :
                       params.prequalified === 'false' ? false : undefined

  const { applicants, total } = await listApplicants({
    page,
    limit: 20,
    search: search || undefined,
    status,
    isPrequalified: prequalified,
  })

  const totalPages = Math.ceil(total / 20)

  // Build query string for pagination links
  const buildQueryString = (newPage: number) => {
    const queryParams = new URLSearchParams()
    queryParams.set('page', newPage.toString())
    if (search) queryParams.set('search', search)
    if (status) queryParams.set('status', status)
    if (params.prequalified) queryParams.set('prequalified', params.prequalified)
    return `?${queryParams.toString()}`
  }

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
            <p className="text-gray-500 mt-1">{total} total applicants</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <form method="GET" className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              name="status"
              defaultValue={status || ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
            >
              {statusFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            {/* Prequalified Filter */}
            <select
              name="prequalified"
              defaultValue={params.prequalified || ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
            >
              <option value="">All Qualification</option>
              <option value="true">Prequalified</option>
              <option value="false">Not Prequalified</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Filter
            </button>

            {/* Clear Filters */}
            {(search || status || params.prequalified) && (
              <Link
                href="/admin/applicants"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear filters
              </Link>
            )}
          </form>
        </div>

        {/* Table */}
        <ApplicantTable applicants={applicants} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-6 py-4">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} results
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/applicants${buildQueryString(page - 1)}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  page > 1
                    ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    : 'text-gray-300 bg-gray-50 border-gray-200 pointer-events-none'
                }`}
                aria-disabled={page <= 1}
              >
                Previous
              </Link>
              <span className="text-sm text-gray-500 px-2">
                Page {page} of {totalPages}
              </span>
              <Link
                href={`/admin/applicants${buildQueryString(page + 1)}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  page < totalPages
                    ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    : 'text-gray-300 bg-gray-50 border-gray-200 pointer-events-none'
                }`}
                aria-disabled={page >= totalPages}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
