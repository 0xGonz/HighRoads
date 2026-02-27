import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getCurrentAdmin } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { AvailabilityForm } from './AvailabilityForm'
import { CopyButton } from './CopyButton'

export const metadata: Metadata = {
  title: 'Availability Settings | Admin Dashboard',
  description: 'Set your available hours for appointments.',
}

export const dynamic = 'force-dynamic'

interface Availability {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
  timezone: string
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

export default async function AvailabilityPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  const supabase = await createServerSupabaseClient()

  // Get existing availability
  const { data: availability, error } = await supabase
    .from('admin_availability')
    .select('*')
    .eq('admin_user_id', admin.id)
    .order('day_of_week', { ascending: true })

  if (error) {
    console.error('Error fetching availability:', error)
  }

  // Create a map of availability by day
  const availabilityMap = new Map<number, Availability>()
  ;(availability || []).forEach((a: Availability) => {
    availabilityMap.set(a.day_of_week, a)
  })

  // Generate default availability for all days
  const defaultAvailability = DAYS.map((_, dayIndex) => {
    const existing = availabilityMap.get(dayIndex)
    if (existing) {
      return existing
    }
    return {
      id: '',
      day_of_week: dayIndex,
      start_time: '09:00',
      end_time: '17:00',
      is_active: dayIndex >= 1 && dayIndex <= 5, // Mon-Fri default
      timezone: 'America/New_York',
    }
  })

  // Generate booking link
  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/book/${admin.id}`

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/calendar"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability Settings</h1>
            <p className="text-gray-500">Set your available hours for applicant bookings</p>
          </div>
        </div>

        {/* Booking Link */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Your Booking Link</h2>
          <p className="text-sm text-gray-600 mb-4">
            Share this link with applicants so they can book a time that works for both of you.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white rounded-lg px-4 py-2 text-sm font-mono text-gray-700 truncate">
              {bookingUrl}
            </div>
            <CopyButton text={bookingUrl} />
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </a>
          </div>
        </div>

        {/* Availability Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Weekly Schedule</h2>
          <AvailabilityForm
            adminId={admin.id}
            initialAvailability={defaultAvailability as Availability[]}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
