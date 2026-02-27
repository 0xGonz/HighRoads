'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface ApplicantNotesFormProps {
  applicantId: string
  currentNotes: string
}

export function ApplicantNotesForm({ applicantId, currentNotes }: ApplicantNotesFormProps) {
  const [notes, setNotes] = useState(currentNotes)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (notes === currentNotes) {
      setMessage({ type: 'error', text: 'No changes to save' })
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
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        throw new Error('Failed to save notes')
      }

      setMessage({ type: 'success', text: 'Notes saved!' })
      router.refresh()
    } catch {
      setMessage({ type: 'error', text: 'Failed to save notes' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Add notes about this applicant..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
      />

      {message && (
        <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading || notes === currentNotes}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Saving...
          </>
        ) : (
          'Save Notes'
        )}
      </button>
    </form>
  )
}
