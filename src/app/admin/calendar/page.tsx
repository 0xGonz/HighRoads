import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings, Plus } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { getCurrentAdmin } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isDemoMode, mockCalendarEvents, mockApplicants } from '@/lib/demo-data'
import { CalendarView } from './CalendarView'

export const metadata: Metadata = {
  title: 'Calendar | Admin Dashboard',
  description: 'Manage your schedule and appointments.',
}

export const dynamic = 'force-dynamic'

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

export default async function CalendarPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  let events: CalendarEvent[] = []

  if (isDemoMode) {
    // Demo mode: use mock events with applicant data
    events = mockCalendarEvents.map(e => ({
      ...e,
      applicants: e.applicant_id
        ? mockApplicants.find(a => a.id === e.applicant_id) || null
        : null,
    })) as CalendarEvent[]
  } else {
    const supabase = await createServerSupabaseClient()

    // Get events for the current week and next 2 weeks
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - startDate.getDay()) // Start of week (Sunday)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 21) // 3 weeks

    const { data, error } = await supabase
      .from('calendar_events')
      .select(`
        *,
        applicants (
          id,
          first_name,
          last_name,
          phone
        )
      `)
      .eq('admin_user_id', admin.id)
      .gte('starts_at', startDate.toISOString())
      .lte('starts_at', endDate.toISOString())
      .order('starts_at', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
    }
    events = (data || []) as CalendarEvent[]
  }

  // Get today's events count
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayEvents = (events || []).filter(e => {
    const eventDate = new Date(e.starts_at)
    return eventDate >= today && eventDate < tomorrow
  })

  // Get upcoming events (next 7 days)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const upcomingEvents = (events || []).filter(e => {
    const eventDate = new Date(e.starts_at)
    return eventDate >= today && eventDate < nextWeek
  })

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-500">
              {todayEvents.length} event{todayEvents.length !== 1 ? 's' : ''} today
              {' '}&middot;{' '}
              {upcomingEvents.length} this week
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/calendar/availability"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Availability
            </Link>
          </div>
        </div>

        {/* Calendar */}
        <CalendarView
          events={events as CalendarEvent[] || []}
          adminId={admin.id}
        />
      </div>
    </AdminLayout>
  )
}
