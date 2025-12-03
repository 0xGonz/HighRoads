'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Applicant, ApplicantStatus } from '@/types/applicant'

const statusConfig: Record<ApplicantStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  carrier_app: { label: 'Carrier App', color: 'bg-purple-100 text-purple-800', icon: Clock },
  pending: { label: 'Pending', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  complete: { label: 'Complete', color: 'bg-green-100 text-green-800', icon: CheckCircle },
}

const statusOptions: ApplicantStatus[] = ['new', 'in_progress', 'carrier_app', 'pending', 'complete']

function ApplicantsContent() {
  const searchParams = useSearchParams()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '')
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) {
        params.append('status', statusFilter)
      }
      const response = await fetch(`/api/applicants?${params}`)
      if (!response.ok) throw new Error('Failed to fetch applicants')
      const data = await response.json()
      setApplicants(data.applicants || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplicants()
  }, [statusFilter])

  const updateApplicantStatus = async (id: string, newStatus: ApplicantStatus) => {
    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update status')
      await fetchApplicants()
      if (selectedApplicant?.id === id) {
        setSelectedApplicant({ ...selectedApplicant, status: newStatus })
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      applicant.first_name.toLowerCase().includes(searchLower) ||
      applicant.last_name.toLowerCase().includes(searchLower) ||
      applicant.email.toLowerCase().includes(searchLower) ||
      applicant.phone.includes(searchTerm)
    )
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusConfig[status].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Applicants List */}
        <div className="flex-1">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-2" />
              <p className="text-gray-500">Loading applicants...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
              <p className="text-gray-500 text-sm mt-2">
                Make sure Supabase is configured correctly.
              </p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No applicants found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplicants.map((applicant) => {
                const StatusIcon = statusConfig[applicant.status].icon
                return (
                  <div
                    key={applicant.id}
                    onClick={() => setSelectedApplicant(applicant)}
                    className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedApplicant?.id === applicant.id
                        ? 'ring-2 ring-accent'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {applicant.first_name} {applicant.last_name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {applicant.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {applicant.phone}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                          statusConfig[applicant.status].color
                        }`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[applicant.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(applicant.created_at)}
                      </span>
                      {applicant.location_state && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {applicant.location_state}
                        </span>
                      )}
                      {applicant.is_prequalified && (
                        <span className="text-green-600 font-medium">Pre-Qualified</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedApplicant && (
          <div className="w-96 bg-white rounded-lg shadow p-6 h-fit sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedApplicant.first_name} {selectedApplicant.last_name}
            </h2>

            {/* Status Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={selectedApplicant.status}
                  onChange={(e) =>
                    updateApplicantStatus(
                      selectedApplicant.id,
                      e.target.value as ApplicantStatus
                    )
                  }
                  className="w-full border rounded-lg px-4 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Contact Info
              </h3>
              <a
                href={`mailto:${selectedApplicant.email}`}
                className="flex items-center text-sm text-primary-700 hover:underline"
              >
                <Mail className="h-4 w-4 mr-2" />
                {selectedApplicant.email}
              </a>
              <a
                href={`tel:${selectedApplicant.phone}`}
                className="flex items-center text-sm text-primary-700 hover:underline"
              >
                <Phone className="h-4 w-4 mr-2" />
                {selectedApplicant.phone}
              </a>
              {selectedApplicant.location_state && (
                <p className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedApplicant.location_state}
                </p>
              )}
            </div>

            {/* Qualifications */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Qualifications
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">CDL:</span>{' '}
                  <span className={selectedApplicant.has_cdl ? 'text-green-600' : 'text-red-600'}>
                    {selectedApplicant.has_cdl ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Medical Card:</span>{' '}
                  <span className={selectedApplicant.has_medical_card ? 'text-green-600' : 'text-red-600'}>
                    {selectedApplicant.has_medical_card ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Experience:</span>{' '}
                  {selectedApplicant.experience_months} months
                </div>
                <div>
                  <span className="text-gray-500">Work Eligible:</span>{' '}
                  <span className={selectedApplicant.us_work_eligible ? 'text-green-600' : 'text-red-600'}>
                    {selectedApplicant.us_work_eligible ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              {selectedApplicant.is_prequalified ? (
                <p className="text-green-600 text-sm font-medium mt-2">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  Pre-Qualified
                </p>
              ) : (
                <p className="text-red-600 text-sm mt-2">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  {selectedApplicant.disqualification_reason}
                </p>
              )}
            </div>

            {/* Preferences */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">
                Preferences
              </h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-500">Budget:</span>{' '}
                  {selectedApplicant.weekly_payment_budget || '—'}
                </p>
                <p>
                  <span className="text-gray-500">Truck:</span>{' '}
                  {selectedApplicant.truck_preference || '—'}
                </p>
                <p>
                  <span className="text-gray-500">Freight:</span>{' '}
                  {selectedApplicant.freight_preference || '—'}
                </p>
                <p>
                  <span className="text-gray-500">Carrier:</span>{' '}
                  {selectedApplicant.has_existing_carrier
                    ? selectedApplicant.carrier_name || 'Yes'
                    : 'Needs matching'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <a
                href={`mailto:${selectedApplicant.email}`}
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </a>
              <a
                href={`tel:${selectedApplicant.phone}`}
                className="flex-1"
              >
                <Button className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-2" />
      <p className="text-gray-500">Loading...</p>
    </div>
  )
}

export default function ApplicantsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-primary-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Applicants</h1>
              <p className="text-gray-200 mt-1">Manage and review applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingFallback />}>
          <ApplicantsContent />
        </Suspense>
      </div>
    </div>
  )
}
