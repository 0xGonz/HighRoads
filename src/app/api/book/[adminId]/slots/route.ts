import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface RouteParams {
  params: Promise<{ adminId: string }>
}

/**
 * GET /api/book/[adminId]/slots
 * Get available time slots for booking
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { adminId } = await params
    const supabase = await createServerSupabaseClient()

    // Get date from query params
    const searchParams = request.nextUrl.searchParams
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json(
        { error: 'date parameter is required' },
        { status: 400 }
      )
    }

    // Parse the date
    const date = new Date(dateStr)
    const dayOfWeek = date.getDay()

    // Get admin availability for this day
    const { data: availability, error: availError } = await supabase
      .from('admin_availability')
      .select('*')
      .eq('admin_user_id', adminId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .single()

    if (availError || !availability) {
      return NextResponse.json({ slots: [] })
    }

    // Get existing events for this date
    const startOfDay = new Date(dateStr)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(dateStr)
    endOfDay.setHours(23, 59, 59, 999)

    const { data: existingEvents } = await supabase
      .from('calendar_events')
      .select('starts_at, ends_at')
      .eq('admin_user_id', adminId)
      .gte('starts_at', startOfDay.toISOString())
      .lte('starts_at', endOfDay.toISOString())
      .neq('status', 'cancelled')

    // Get blocked times for this date
    const { data: blockedTimes } = await supabase
      .from('admin_blocked_times')
      .select('starts_at, ends_at')
      .eq('admin_user_id', adminId)
      .lte('starts_at', endOfDay.toISOString())
      .gte('ends_at', startOfDay.toISOString())

    // Generate time slots (30-minute intervals)
    const slots: string[] = []
    const [startHour, startMin] = availability.start_time.split(':').map(Number)
    const [endHour, endMin] = availability.end_time.split(':').map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60)
      const min = minutes % 60
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`

      // Check if this slot is available
      const slotStart = new Date(dateStr)
      slotStart.setHours(hour, min, 0, 0)
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + 30)

      // Skip past times for today
      const now = new Date()
      if (slotStart < now) {
        continue
      }

      // Check against existing events
      const hasConflict = (existingEvents || []).some((event) => {
        const eventStart = new Date(event.starts_at)
        const eventEnd = new Date(event.ends_at)
        return slotStart < eventEnd && slotEnd > eventStart
      })

      if (hasConflict) {
        continue
      }

      // Check against blocked times
      const isBlocked = (blockedTimes || []).some((block) => {
        const blockStart = new Date(block.starts_at)
        const blockEnd = new Date(block.ends_at)
        return slotStart < blockEnd && slotEnd > blockStart
      })

      if (isBlocked) {
        continue
      }

      slots.push(timeStr)
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Get slots error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
