'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Check, Calendar, Clock, User, Mail, Phone } from 'lucide-react'

interface BookingCalendarProps {
  adminId: string
  availableDays: number[]
}

interface BookingInfo {
  name: string
  email: string
  phone: string
  notes: string
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function BookingCalendar({ adminId, availableDays }: BookingCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [step, setStep] = useState<'date' | 'time' | 'info' | 'confirmed'>('date')
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Generate calendar days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  const calendarDays: (number | null)[] = []

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push(null)
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Check if a date is selectable
  const isDateSelectable = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const dayOfWeek = date.getDay()

    // Check if day of week is available
    if (!availableDays.includes(dayOfWeek)) {
      return false
    }

    // Check if date is in the past
    const todayStart = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    if (date < todayStart) {
      return false
    }

    return true
  }

  // Fetch available slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([])
      return
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true)
      setError('')
      try {
        const dateStr = selectedDate.toISOString().split('T')[0]
        const response = await fetch(`/api/book/${adminId}/slots?date=${dateStr}`)
        if (!response.ok) throw new Error('Failed to fetch slots')
        const data = await response.json()
        setAvailableSlots(data.slots || [])
      } catch (err) {
        console.error('Fetch slots error:', err)
        setError('Failed to load available times')
        setAvailableSlots([])
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [selectedDate, adminId])

  const handleDateSelect = (day: number) => {
    if (!isDateSelectable(day)) return
    const date = new Date(currentYear, currentMonth, day)
    setSelectedDate(date)
    setSelectedTime(null)
    setStep('time')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep('info')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/book/${adminId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          name: bookingInfo.name,
          email: bookingInfo.email,
          phone: bookingInfo.phone,
          notes: bookingInfo.notes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to book')
      }

      setStep('confirmed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Confirmed view
  if (step === 'confirmed') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          We've sent a confirmation email to {bookingInfo.email}
        </p>
        <div className="bg-gray-50 rounded-xl p-6 max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-gray-900">
              {selectedDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-gray-900">{selectedTime && formatTime(selectedTime)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          We'll call you at the scheduled time. Please make sure you're available.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Calendar Side */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const isSelectable = isDateSelectable(day)
              const isSelected = selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentMonth &&
                selectedDate?.getFullYear() === currentYear
              const isToday = day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  disabled={!isSelectable}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors
                    ${isSelected
                      ? 'bg-primary-600 text-white font-semibold'
                      : isSelectable
                        ? 'hover:bg-primary-50 text-gray-900'
                        : 'text-gray-300 cursor-not-allowed'
                    }
                    ${isToday && !isSelected ? 'ring-2 ring-primary-600 ring-offset-2' : ''}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {availableDays.length === 0 && (
            <p className="text-center text-gray-500 mt-6 text-sm">
              No availability configured. Please contact us directly.
            </p>
          )}
        </div>

        {/* Time Slots / Info Form Side */}
        <div className="p-6">
          {step === 'date' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a date to see available times</p>
              </div>
            </div>
          )}

          {step === 'time' && (
            <>
              <h3 className="font-semibold text-gray-900 mb-4">
                Available times for{' '}
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>

              {isLoadingSlots ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                </div>
              ) : error ? (
                <p className="text-red-600 text-center py-12">{error}</p>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No available times for this date.</p>
                  <p className="text-sm mt-1">Please select another day.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors
                        ${selectedTime === time
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-50 text-gray-900 hover:bg-primary-50 hover:text-primary-700'
                        }
                      `}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep('date')}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to calendar
              </button>
            </>
          )}

          {step === 'info' && (
            <>
              <h3 className="font-semibold text-gray-900 mb-1">Your Information</h3>
              <p className="text-sm text-gray-500 mb-6">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at {selectedTime && formatTime(selectedTime)}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={bookingInfo.name}
                      onChange={(e) => setBookingInfo({ ...bookingInfo, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={bookingInfo.email}
                      onChange={(e) => setBookingInfo({ ...bookingInfo, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={bookingInfo.phone}
                      onChange={(e) => setBookingInfo({ ...bookingInfo, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={bookingInfo.notes}
                    onChange={(e) => setBookingInfo({ ...bookingInfo, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                    placeholder="Anything you'd like us to know..."
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </form>

              <button
                onClick={() => setStep('time')}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                ← Choose a different time
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
