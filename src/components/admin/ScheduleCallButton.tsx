'use client'

import { useState } from 'react'
import { Phone, X, Loader2, Calendar, Clock } from 'lucide-react'

interface ScheduleCallButtonProps {
  applicantId: string
  applicantName: string
  applicantPhone: string | null
  variant?: 'default' | 'compact'
}

const TIME_OPTIONS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
]

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function ScheduleCallButton({
  applicantId,
  applicantName,
  applicantPhone,
  variant = 'default',
}: ScheduleCallButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00',
    notes: '',
  })

  // Get min date (today)
  const today = new Date()
  const minDate = today.toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Calculate start and end times
      const [hour, minute] = formData.time.split(':').map(Number)
      const startsAt = new Date(formData.date)
      startsAt.setHours(hour, minute, 0, 0)
      const endsAt = new Date(startsAt)
      endsAt.setMinutes(endsAt.getMinutes() + 30)

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Call with ${applicantName}`,
          event_type: 'call',
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          applicant_id: applicantId,
          phone_number: applicantPhone,
          notes: formData.notes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to schedule call')
      }

      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setFormData({ date: '', time: '10:00', notes: '' })
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule')
    } finally {
      setIsSubmitting(false)
    }
  }

  const buttonClasses = variant === 'compact'
    ? 'inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
    : 'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors'

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClasses}
      >
        <Phone className="h-4 w-4" />
        {variant === 'compact' ? 'Call' : 'Schedule Call'}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isSubmitting && setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Schedule Call</h2>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-gray-900">Call Scheduled!</p>
                <p className="text-gray-500 mt-1">
                  Added to your calendar
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Schedule a call with <span className="font-medium text-gray-900">{applicantName}</span>
                    {applicantPhone && (
                      <span className="text-gray-500"> at {applicantPhone}</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      required
                      min={minDate}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {formatTime(time)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                    placeholder="What to discuss..."
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      'Schedule Call'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
