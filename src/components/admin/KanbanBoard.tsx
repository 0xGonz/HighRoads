'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GripVertical, Phone, Mail, ChevronRight } from 'lucide-react'
import type { Applicant, ApplicantStatus } from '@/types/database'
import { statusColors, statusLabels } from '@/lib/design-tokens'

interface KanbanBoardProps {
  applicantsByStatus: Record<ApplicantStatus, Applicant[]>
}

const columns: { id: ApplicantStatus; title: string }[] = [
  { id: 'new', title: statusLabels.new },
  { id: 'in_progress', title: statusLabels.in_progress },
  { id: 'carrier_app', title: statusLabels.carrier_app },
  { id: 'pending', title: statusLabels.pending },
  { id: 'complete', title: statusLabels.complete },
]

export function KanbanBoard({ applicantsByStatus }: KanbanBoardProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<ApplicantStatus | null>(null)
  const router = useRouter()

  const handleDragStart = (e: React.DragEvent, applicantId: string) => {
    setDragging(applicantId)
    e.dataTransfer.setData('applicantId', applicantId)
  }

  const handleDragOver = (e: React.DragEvent, status: ApplicantStatus) => {
    e.preventDefault()
    setDragOver(status)
  }

  const handleDragLeave = () => {
    setDragOver(null)
  }

  const handleDrop = async (e: React.DragEvent, newStatus: ApplicantStatus) => {
    e.preventDefault()
    const applicantId = e.dataTransfer.getData('applicantId')

    setDragging(null)
    setDragOver(null)

    if (!applicantId) return

    try {
      const response = await fetch(`/api/applicants/${applicantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const getColumnColors = (status: ApplicantStatus) => statusColors[status] || statusColors.new

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const colors = getColumnColors(column.id)
        const isDropTarget = dragOver === column.id

        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-72 rounded-xl transition-all duration-200 ${
              isDropTarget
                ? 'bg-primary-50 ring-2 ring-primary-400 ring-dashed'
                : 'bg-gray-50'
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`p-4 rounded-t-xl ${colors.light}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                </div>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {applicantsByStatus[column.id]?.length || 0}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className={`p-2 space-y-2 min-h-[400px] transition-colors duration-200 ${
              isDropTarget ? 'bg-primary-50/50' : ''
            }`}>
              {applicantsByStatus[column.id]?.map((applicant) => (
                <KanbanCard
                  key={applicant.id}
                  applicant={applicant}
                  isDragging={dragging === applicant.id}
                  onDragStart={(e) => handleDragStart(e, applicant.id)}
                />
              ))}
              {(!applicantsByStatus[column.id] || applicantsByStatus[column.id].length === 0) && (
                <div className={`py-8 text-center text-sm rounded-lg border-2 border-dashed ${
                  isDropTarget ? 'border-primary-300 text-primary-500' : 'border-gray-200 text-gray-400'
                }`}>
                  {isDropTarget ? 'Drop here' : 'No applicants'}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KanbanCard({
  applicant,
  isDragging,
  onDragStart,
}: {
  applicant: Applicant
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
}) {
  const daysInStatus = Math.floor(
    (Date.now() - new Date(applicant.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`bg-white rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging
          ? 'opacity-50 scale-95 shadow-lg rotate-2 border-primary-300'
          : 'shadow-sm border-gray-200 hover:shadow-md hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900 truncate">
              {applicant.first_name} {applicant.last_name}
            </p>
            <Link
              href={`/admin/applicants/${applicant.id}`}
              className="p-1 rounded hover:bg-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center text-xs text-gray-500">
              <Phone className="h-3 w-3 mr-1" />
              {applicant.phone}
            </div>
            <div className="flex items-center text-xs text-gray-500 truncate">
              <Mail className="h-3 w-3 mr-1" />
              {applicant.email}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            {applicant.is_prequalified ? (
              <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                Prequalified
              </span>
            ) : (
              <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                Not Qualified
              </span>
            )}
            <span className="text-xs text-gray-400">
              {daysInStatus === 0 ? 'Today' : `${daysInStatus}d`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
