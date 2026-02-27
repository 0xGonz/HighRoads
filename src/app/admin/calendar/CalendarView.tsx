'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Phone, Video, Clock, User, Plus, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CalendarEvent {
  id: string
  admin_user_id: string
  applicant_id: string | null
  title: string
  description: string | null
  event_type: string
  starts_at: string
  ends_at: string
  status: string
  phone_number: string | null
  meeting_link: string | null
  applicants?: {
    id: string
    first_name: string
    last_name: string
    phone: string
  } | null
}

interface CalendarViewProps {
  events: CalendarEvent[]
  adminId: string
}

export function CalendarView({ events, adminId }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createDate, setCreateDate] = useState<Date | null>(null)

  // Get start of current week (Sunday)
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  // Generate time slots (8 AM to 6 PM)
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8)

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getEventsForSlot = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.starts_at)
      return (
        eventDate.toDateString() === date.toDateString() &&
        eventDate.getHours() === hour
      )
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const formatWeekRange = () => {
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' })
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' })
    const year = startOfWeek.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${year}`
    }
    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${year}`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{formatWeekRange()}</h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-gray-100">
            <div className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wide" />
            {weekDays.map((date, i) => (
              <div
                key={i}
                className={`p-3 text-center border-l border-gray-100 ${
                  isToday(date) ? 'bg-primary-50' : ''
                }`}
              >
                <p className="text-xs font-medium text-gray-500 uppercase">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-semibold mt-1 ${
                  isToday(date) ? 'text-primary-600' : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="divide-y divide-gray-100">
            {timeSlots.map((hour) => (
              <div key={hour} className="grid grid-cols-8 min-h-[60px]">
                <div className="p-2 text-xs text-gray-500 text-right pr-3">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                {weekDays.map((date, dayIndex) => {
                  const slotEvents = getEventsForSlot(date, hour)
                  return (
                    <div
                      key={dayIndex}
                      className={`border-l border-gray-100 p-1 ${
                        isToday(date) ? 'bg-primary-50/30' : ''
                      }`}
                      onClick={() => {
                        const clickDate = new Date(date)
                        clickDate.setHours(hour, 0, 0, 0)
                        setCreateDate(clickDate)
                        setShowCreateModal(true)
                      }}
                    >
                      {slotEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEvent(event)
                          }}
                          className={`w-full text-left p-1.5 rounded text-xs mb-1 transition-colors ${
                            event.event_type === 'call'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : event.event_type === 'meeting'
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {event.event_type === 'call' ? (
                              <Phone className="h-3 w-3" />
                            ) : event.event_type === 'meeting' ? (
                              <Video className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            <span className="truncate font-medium">{event.title}</span>
                          </div>
                          {event.applicants && (
                            <p className="truncate mt-0.5 opacity-75">
                              {event.applicants.first_name} {event.applicants.last_name}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Create Event Modal */}
      {showCreateModal && createDate && (
        <CreateEventModal
          adminId={adminId}
          initialDate={createDate}
          onClose={() => {
            setShowCreateModal(false)
            setCreateDate(null)
          }}
        />
      )}
    </div>
  )
}

function EventDetailModal({
  event,
  onClose,
}: {
  event: CalendarEvent
  onClose: () => void
}) {
  const startTime = new Date(event.starts_at)
  const endTime = new Date(event.ends_at)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>
              {startTime.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
              {' '}at{' '}
              {startTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
              {' '}-{' '}
              {endTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>

          {event.applicants && (
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <Link
                href={`/admin/applicants/${event.applicants.id}`}
                className="text-primary-600 hover:underline"
              >
                {event.applicants.first_name} {event.applicants.last_name}
              </Link>
            </div>
          )}

          {event.phone_number && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <a
                href={`tel:${event.phone_number}`}
                className="text-primary-600 hover:underline"
              >
                {event.phone_number}
              </a>
            </div>
          )}

          {event.meeting_link && (
            <div className="flex items-center gap-3 text-sm">
              <Video className="h-4 w-4 text-gray-400" />
              <a
                href={event.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                Join Meeting
              </a>
            </div>
          )}

          {event.description && (
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          )}

          <div className="pt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              event.status === 'scheduled'
                ? 'bg-blue-100 text-blue-700'
                : event.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : event.status === 'cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {event.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateEventModal({
  adminId,
  initialDate,
  onClose,
}: {
  adminId: string
  initialDate: Date
  onClose: () => void
}) {
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState<'call' | 'meeting' | 'other'>('call')
  const [date, setDate] = useState(initialDate.toISOString().split('T')[0])
  const [startTime, setStartTime] = useState(
    `${initialDate.getHours().toString().padStart(2, '0')}:00`
  )
  const [duration, setDuration] = useState('30')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const startsAt = new Date(`${date}T${startTime}`)
      const endsAt = new Date(startsAt.getTime() + parseInt(duration) * 60 * 1000)

      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || `${eventType === 'call' ? 'Phone Call' : eventType === 'meeting' ? 'Meeting' : 'Event'}`,
          event_type: eventType,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          phone_number: phoneNumber || null,
          description: notes || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create event')
      }

      // Refresh the page to show new event
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">New Event</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <div className="flex gap-2">
              {(['call', 'meeting', 'other'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    eventType === type
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type === 'call' ? 'Call' : type === 'meeting' ? 'Meeting' : 'Other'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={eventType === 'call' ? 'Phone Call' : eventType === 'meeting' ? 'Meeting' : 'Event'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {eventType === 'call' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
