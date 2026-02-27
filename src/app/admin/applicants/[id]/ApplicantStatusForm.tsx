'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { ApplicantStatus } from '@/types/database'

interface ApplicantStatusFormProps {
  applicantId: string
  currentStatus: ApplicantStatus
}

const statusOptions: { value: ApplicantStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'carrier_app', label: 'Carrier Application' },
  { value: 'pending', label: 'Pending' },
  { value: 'complete', label: 'Complete' },
  { value: 'disqualified', label: 'Disqualified' },
]

export function ApplicantStatusForm({ applicantId, currentStatus }: ApplicantStatusFormProps) {
  const [status, setStatus] = useState<ApplicantStatus>(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status === currentStatus) {
      setMessage({ type: 'error', text: 'Status unchanged' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/applicants/${applicantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setMessage({ type: 'success', text: 'Status updated!' })
      router.refresh()
    } catch {
      setMessage({ type: 'error', text: 'Failed to update status' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as ApplicantStatus)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {message && (
        <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading || status === currentStatus}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Updating...
          </>
        ) : (
          'Update Status'
        )}
      </button>
    </form>
  )
}
