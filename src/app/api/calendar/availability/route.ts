import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isDemoMode, mockAvailability } from '@/lib/demo-data'

interface AvailabilityInput {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
  timezone?: string
}

/**
 * GET /api/calendar/availability
 * Get admin availability settings
 */
export async function GET(request: NextRequest) {
  try {
    // Demo mode: return mock availability
    if (isDemoMode) {
      return NextResponse.json({ availability: mockAvailability })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('admin_availability')
      .select('*')
      .eq('admin_user_id', user.id)
      .order('day_of_week', { ascending: true })

    if (error) {
      console.error('Get availability error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ availability: data || [] })
  } catch (error) {
    console.error('Availability API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/calendar/availability
 * Update admin availability settings
 */
export async function PUT(request: NextRequest) {
  try {
    // Demo mode: simulate success
    if (isDemoMode) {
      const body = await request.json()
      const { availability } = body as { availability: AvailabilityInput[] }
      // Return the input as if it was saved
      const updated = availability.map((a, idx) => ({
        ...a,
        id: a.id || `avail-demo-${idx}`,
        admin_user_id: 'demo-admin',
        timezone: a.timezone || 'America/New_York',
      }))
      return NextResponse.json({ availability: updated })
    }

    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { availability } = body as { availability: AvailabilityInput[] }

    if (!availability || !Array.isArray(availability)) {
      return NextResponse.json(
        { error: 'availability array is required' },
        { status: 400 }
      )
    }

    // Get existing availability
    const { data: existing } = await supabase
      .from('admin_availability')
      .select('id, day_of_week')
      .eq('admin_user_id', user.id)

    const existingMap = new Map<number, string>()
    ;(existing || []).forEach((e: { id: string; day_of_week: number }) => {
      existingMap.set(e.day_of_week, e.id)
    })

    // Upsert each day's availability
    for (const day of availability) {
      const existingId = existingMap.get(day.day_of_week)

      if (existingId) {
        // Update existing
        await supabase
          .from('admin_availability')
          .update({
            start_time: day.start_time,
            end_time: day.end_time,
            is_active: day.is_active,
            timezone: day.timezone || 'America/New_York',
          })
          .eq('id', existingId)
      } else {
        // Insert new
        await supabase
          .from('admin_availability')
          .insert({
            admin_user_id: user.id,
            day_of_week: day.day_of_week,
            start_time: day.start_time,
            end_time: day.end_time,
            is_active: day.is_active,
            timezone: day.timezone || 'America/New_York',
          })
      }
    }

    // Fetch updated availability
    const { data: updated, error } = await supabase
      .from('admin_availability')
      .select('*')
      .eq('admin_user_id', user.id)
      .order('day_of_week', { ascending: true })

    if (error) {
      console.error('Update availability error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ availability: updated || [] })
  } catch (error) {
    console.error('Update availability error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
