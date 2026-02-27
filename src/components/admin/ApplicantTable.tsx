'use client'

import Link from 'next/link'
import { ChevronRight, Phone, Mail, CheckCircle, XCircle } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import type { Applicant } from '@/types/database'

interface ApplicantTableProps {
  applicants: Applicant[]
}

export function ApplicantTable({ applicants }: ApplicantTableProps) {
  if (applicants.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500">No applicants found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Qualified
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Applied
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium text-gray-900">
                      {applicant.first_name} {applicant.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {applicant.location_state || 'Unknown location'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                      {applicant.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1.5 text-gray-400" />
                      {applicant.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {applicant.is_prequalified ? (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600">
                      <XCircle className="h-5 w-5 mr-1" />
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={applicant.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(applicant.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    href={`/admin/applicants/${applicant.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium text-sm"
                  >
                    View
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
