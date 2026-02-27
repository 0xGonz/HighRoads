'use client'

import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'

interface Availability {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
  timezone: string
}

interface AvailabilityFormProps {
  adminId: string
  initialAvailability: Availability[]
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00',
]

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function AvailabilityForm({ adminId, initialAvailability }: AvailabilityFormProps) {
  const [availability, setAvailability] = useState<Availability[]>(initialAvailability)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  const updateDay = (dayIndex: number, updates: Partial<Availability>) => {
    setAvailability(prev => prev.map((a, i) =>
      i === dayIndex ? { ...a, ...updates } : a
    ))
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    setError('')
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/calendar/availability', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save availability')
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {availability.map((day, index) => (
        <div
          key={index}
          className={`flex items-center gap-4 p-4 rounded-lg border ${
            day.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
          }`}
        >
          {/* Day Toggle */}
          <label className="flex items-center gap-3 cursor-pointer w-32">
            <input
              type="checkbox"
              checked={day.is_active}
              onChange={(e) => updateDay(index, { is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className={`font-medium ${day.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
              {DAYS[index]}
            </span>
          </label>

          {/* Time Range */}
          <div className={`flex items-center gap-2 flex-1 ${!day.is_active ? 'opacity-50' : ''}`}>
            <select
              value={day.start_time}
              onChange={(e) => updateDay(index, { start_time: e.target.value })}
              disabled={!day.is_active}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-gray-100"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
            <span className="text-gray-500">to</span>
            <select
              value={day.end_time}
              onChange={(e) => updateDay(index, { end_time: e.target.value })}
              disabled={!day.is_active}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-gray-100"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="text-sm text-gray-500 w-24 text-right">
            {day.is_active ? 'Available' : 'Unavailable'}
          </div>
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-4">
        {saveSuccess && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <Check className="h-4 w-4" />
            Saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  )
}
